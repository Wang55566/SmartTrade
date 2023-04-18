from flask import Blueprint, jsonify, request
from app.models import db, User, List, Task
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

from ..forms import TaskForm

tasks = Blueprint('tasks', __name__)

# get all tasks
@tasks.route('/all')
@login_required
def allTasks():
  id = current_user.id
  tasks = Task.query.filter(Task.user_id == id).all()
  tasksList = {}
  tasksList['tasks'] = [task.to_dict() for task in tasks]
  tasksList['numCompleted'] = 0
  tasksList['numNotCompleted'] = 0
  for task in tasks:
    if task.completed == True:  tasksList['numCompleted'] += 1
    else: tasksList['numNotCompleted'] += 1
  return tasksList

# get a single task
@tasks.route('/<int:id>')
@login_required
def oneTask(id):
  task = Task.query.get(id)
  taskDict = task.to_dict()
  if task.list:
    taskDict['list'] = task.list.to_dict()
  return taskDict

# create a task
@tasks.route('', methods=['POST'])
@login_required
def createTask():
  form = TaskForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    new_task = Task (
      name = form.data['name'],
      due_date = form.data['due_date'],
      user_id = current_user.id,
      list_id = form.data['list_id'],
    )
    db.session.add(new_task)
    db.session.commit()
    return new_task.to_dict()
  return "Bad Data"

# rename a task
@tasks.route('/<int:id>', methods=['PUT'])
@login_required
def renameTask(id):
  form = TaskForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  task = Task.query.get(id)
  if form.validate_on_submit():
    task.name = form.data['name']
    db.session.commit()
    return task.to_dict()
  return "Bad Data"

# change task from incomplete to complete or vice versa
@tasks.route('/<int:id>/completed', methods=['PUT'])
@login_required
def completeOrIncompleteTask(id):
  task = Task.query.get(id)
  task.completed = not task.completed
  db.session.commit()
  return task.to_dict()

# add a task to a list
@tasks.route('/<int:task_id>/list', methods=['PUT'])
@login_required
def addTasktoList(task_id):
  listId = request.json['listId']
  task = Task.query.get(task_id)
  task.list_id = listId
  db.session.commit()
  return task.to_dict()

# delete task
@tasks.route('/<int:id>', methods=['DELETE'])
@login_required
def deleteTask(id):
  task = Task.query.get(id)
  taskDict = task.to_dict()
  db.session.delete(task)
  db.session.commit()
  return taskDict
