from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired

class AssetForm(FlaskForm):
    symbol = StringField('symbol', validators=[DataRequired()])
    average_cost = FloatField('average_cost', validators=[DataRequired()])
    shares = IntegerField('shares', validators=[DataRequired()])
