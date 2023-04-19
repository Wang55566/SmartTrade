from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired

class BuyForm(FlaskForm):
    symbol = StringField('symbol', validators=[DataRequired()])
    average_cost = FloatField('average_cost', validators=[DataRequired()])
    shares = IntegerField('shares', validators=[DataRequired()])
    user_id = IntegerField('user_id', validators=[DataRequired()])

class UpdatdForm(FlaskForm):
    average_cost = FloatField('average_cost', validators=[DataRequired()])
    shares = IntegerField('shares', validators=[DataRequired()])
