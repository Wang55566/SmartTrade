from flask import Blueprint, jsonify, request
from app.models import db, User, Watchlist
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

from app.forms import WatchlistForm

import requests
import os

watchlist_routes = Blueprint('watchlists', __name__)

# Get all watchlists
@watchlist_routes.route('')
@login_required
def all_watchlists():

  watchlists = Watchlist.query.filter(Watchlist.user_id == current_user.id).all()

  watchlist_dict = {}
  for watchlist in watchlists:
    watchlist_data = watchlist.to_dict()
    watchlist_dict[watchlist.id] = watchlist_data

  print('--------------Get All Watchlists--------------')

  return watchlist_dict

# Get one watchlist
@watchlist_routes.route('/<int:id>')
@login_required
def one_watchlist(id):

    watchlist = Watchlist.query.get(id)

    watchlistDict = watchlist.to_dict()

    for stock in watchlist.liststocks:
      watchlistDict['liststocks'][stock.id] = stock.to_dict()

    print('--------------Get One Watchlist--------------')
    print(watchlistDict)
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

    form = WatchlistForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
      watchlist = Watchlist(
        user_id = current_user.id,
        name = form.data['name'],
        number_of_stocks = form.data['number_of_stocks'],
      )

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
