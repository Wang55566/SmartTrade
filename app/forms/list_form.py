from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired
from app.models import List

v = [DataRequired()]

class ListForm(FlaskForm):
    name = StringField('name', v)
