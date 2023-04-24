from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired

class WatchlistForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    number_of_stocks = IntegerField('number_of_stocks')
