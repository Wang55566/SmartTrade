from flask import Blueprint, jsonify, request
from app.models import db, User, Watchlist, ListStock
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

from app.forms import WatchlistForm, ListStockForm

import requests
import os

watchlist_routes = Blueprint('watchlists', __name__)

api_key = os.environ.get('API_KEY')

# Get all watchlists
@watchlist_routes.route('')
@login_required
def all_watchlists():

  watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.id).all()
  watchlist_dict = {}
  for watchlist in watchlists:
    stock_list = []
    watchlist_data = watchlist.to_dict()
    watchlist_dict[watchlist.id] = watchlist_data
    stock_list = []
    for stock in watchlist.liststocks:
      stock_list.append(stock.to_dict())
    watchlist_dict[watchlist.id]['stocks'] = stock_list

  print('--------------Get All Watchlists--------------')

  return watchlist_dict

# Get one watchlist
@watchlist_routes.route('/<int:id>')
@login_required
def one_watchlist(id):

    watchlist = Watchlist.query.get(id)

    watchlistDict = watchlist.to_dict()

    stock_list = []

    for stock in watchlist.liststocks:
      stock_dict = stock.to_dict()
      symbol = stock_dict['symbol']
      url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
      r = requests.get(url)
      data = r.json()
      market_price = data["Global Quote"]["05. price"]

      rounded_market_price = round(float(market_price), 2)
      stock_dict['market_price'] = rounded_market_price
      stock_list.append(stock_dict)

    watchlistDict['stocks'] = stock_list

    print('--------------Get One Watchlist--------------')
    return watchlistDict

# Create a watchlist
@watchlist_routes.route('', methods=['POST'])
@login_required
def create_watchlist():

    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
      watchlist = Watchlist(
        user_id = current_user.id,
        name = form.data['name']
      )
      db.session.add(watchlist)
      db.session.commit()
      print('--------------Create Watchlist--------------')
      return watchlist.to_dict()


# Update a watchlist
@watchlist_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_watchlist(id):

    watchlist = Watchlist.query.get(id)
    print(watchlist.to_dict())
    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

      watchlist.name = form.data['name']

      db.session.commit()

      print('--------------Update Watchlist--------------')
      return watchlist.to_dict()

# Delete a watchlist
@watchlist_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_watchlist(id):

    watchlist = Watchlist.query.get(id)

    db.session.delete(watchlist)
    db.session.commit()

    print('--------------Delete Watchlist--------------')
    return watchlist.to_dict()

# Add a stock to a watchlist
@watchlist_routes.route('/<int:id>/add', methods=['POST'])
@login_required
def add_stock(id):

    watchlist = Watchlist.query.get(id)

    form = ListStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
      liststock = ListStock(
        symbol = form.data['symbol'],
        market_price = form.data['market_price'],
        watchlist_id = form.data['watchlist_id']
      )
      db.session.add(liststock)

      watchlist.number_of_stocks += 1
      db.session.commit()

      return watchlist.to_dict()

# Move a stock to a different watchlist
@watchlist_routes.route('/<int:watchlist_id>/move/<string:symbol>', methods=['PUT'])
@login_required
def move_stock(symbol, watchlist_id):

    watchlist = Watchlist.query.get(watchlist_id)

    stock = ListStock.query.filter(ListStock.symbol == symbol).first()

    form = ListStockForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
      stock.watchlist_id = form.data['watchlist_id']

      db.session.commit()

      return watchlist.to_dict()

# Delete a stock from a watchlist
@watchlist_routes.route('/<int:watchlist_id>/remove/<string:symbol>', methods=['DELETE'])
@login_required
def delete_stock(symbol, watchlist_id):

    watchlist = Watchlist.query.get(watchlist_id)

    stock = ListStock.query.filter(ListStock.symbol == symbol).first()

    db.session.delete(stock)

    watchlist.number_of_stocks -= 1
    db.session.commit()

    print('--------------Delete Stock--------------')
    return watchlist.to_dict()
