from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired

class TransactionForm(FlaskForm):
  available_cash = FloatField('available_cash', validators=[DataRequired()])
