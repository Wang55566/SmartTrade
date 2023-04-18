from flask import Blueprint, jsonify, request
from app.models import db, User, List, Task
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages
from ..forms import ListForm

lists = Blueprint('lists', __name__)

@lists.route('/all')
@login_required
def allLists():
  id = current_user.id
  lists = List.query.filter(List.user_id == id).all()
  listsList = [list.to_dict() for list in lists]
  return listsList


# get a single list (with tasks) and numCompleted/numNotCompleted
@lists.route('/<int:id>')
@login_required
def oneList(id):
  list = List.query.get(id)
  listDict = list.to_dict()
  listDict['tasks'] = []
  listDict['numCompleted'] = 0
  listDict['numNotCompleted'] = 0
  for task in list.tasks:
    listDict['tasks'].append(task.to_dict())
    if task.completed == True:  listDict['numCompleted'] += 1
    else: listDict['numNotCompleted'] += 1
  return listDict

# create list
@lists.route('', methods=['POST'])
@login_required
def createList():
  form = ListForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    new_list = List (
      name = form.data['name'],
      user_id = current_user.id
    )
    db.session.add(new_list)
    db.session.commit()
    return new_list.to_dict()
  return "Bad Data"


# rename a list
@lists.route('/<int:id>', methods=['PUT'])
@login_required
def renameList(id):
  form = ListForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  list = List.query.get(id)
  if form.validate_on_submit():
    list.name = form.data['name']
    db.session.commit()
    return list.to_dict()
  return "Bad Data"

# delete list
@lists.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteList(id):
  list = List.query.get(id)
  deletedList = list.to_dict()
  db.session.delete(list)
  db.session.commit()
  return deletedList
