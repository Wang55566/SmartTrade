from flask import Blueprint, jsonify, request
from app.models import db, User, Asset
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

from app.forms import BuyForm, UpdateForm

import requests
import os

asset_routes = Blueprint('assets', __name__)

api_key = os.environ.get('API_KEY')

# Get all assets
@asset_routes.route('')
@login_required
def all_assets():

  assets = Asset.query.filter(Asset.user_id == current_user.id).all()

  asset_list = {}
  asset_list['assets'] = [asset.to_dict() for asset in assets]

  for asset in asset_list['assets']:

    url = url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={asset["symbol"]}&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    asset['market_price'] = data['Global Quote']['05. price']

  return asset_list

# Get one asset
@asset_routes.route('/<int:id>')
@login_required
def one_asset(id):

    asset = Asset.query.get(id)

    assetDict = asset.to_dict()

    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={assetDict["symbol"]}&apikey={api_key}'
    r = requests.get(url)
    data = r.json()

    assetDict['market_price'] = data['Global Quote']['05. price']

    return assetDict

# Create an asset
@asset_routes.route('', methods=['POST'])
@login_required
def create_asset():

  form = BuyForm()

  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():

    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={form.data["symbol"]}&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    cost = data['Global Quote']['05. price']

    new_asset = Asset(
      user_id=current_user.id,
      symbol=form.data['symbol'],
      average_cost=cost,
      shares=form.data['shares']
    )

    db.session.add(new_asset)
    db.session.commit()

    return new_asset.to_dict()

# Update an asset
@asset_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_asset(id):
  asset = Asset.query.get(id)
  form = UpdateForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    asset.average_cost = form.data['average_cost']
    asset.shares = form.data['shares']
    db.session.commit()

    assetDict = asset.to_dict()

    url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={assetDict["symbol"]}&apikey={api_key}'
    r = requests.get(url)
    data = r.json()

    assetDict['market_price'] = data['Global Quote']['05. price']

    return assetDict

# Delete an asset
@asset_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_asset(id):
  asset = Asset.query.get(id)
  db.session.delete(asset)
  db.session.commit()
  return f'{id} deleted'
