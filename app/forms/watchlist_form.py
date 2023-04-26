from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, FloatField
from wtforms.validators import DataRequired

class WatchlistForm(FlaskForm):
    name = StringField('name', validators=[DataRequired()])
    number_of_stocks = IntegerField('number_of_stocks')
    id = IntegerField('id')

class ListStockForm(FlaskForm):
    symbol = StringField('symbol', validators=[DataRequired()])
    market_price = FloatField('market_price', validators=[DataRequired()])
    watchlist_id = IntegerField('watchlist_id', validators=[DataRequired()])
