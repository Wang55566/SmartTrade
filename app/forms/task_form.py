from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, BooleanField
from wtforms.validators import DataRequired
from app.models import Task

v = [DataRequired()]

class TaskForm(FlaskForm):
    name = StringField('name', v)
    due_date = DateField('due_date')
    list_id = IntegerField('list_id')
