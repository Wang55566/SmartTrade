from flask import Blueprint, jsonify, request
from app.models import db, User, List, Task
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

search = Blueprint('search', __name__)

@search.route('')
@login_required
def allTasksSearch():
  id = current_user.id
  args = request.args
  search = args.get("search", default="", type=str)
  tasks = (Task.query.filter(Task.user_id == id)
  .filter(Task.name.ilike(f'%{search}%'))
  .all())
  taskSearch = {}
  taskSearch['tasks'] = [task.to_dict() for task in tasks]
  taskSearch['numCompleted'] = 0
  taskSearch['numNotCompleted'] = 0
  for task in taskSearch['tasks']:
    if task['completed'] == True:  taskSearch['numCompleted'] += 1
    else: taskSearch['numNotCompleted'] += 1
  return taskSearch
