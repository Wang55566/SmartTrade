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

  # Need to fetch data from a new API
  # websocket api?

  assets = Asset.query.filter(Asset.user_id == current_user.id).all()

  asset_dict = {}
  for asset in assets:
    asset_data = asset.to_dict()

    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={asset_data["symbol"]}&interval=1min&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    market_price = data["Time Series (1min)"][list(data["Time Series (1min)"].keys())[0]]["4. close"]
    rounded_market_price = round(float(market_price), 2)

    # url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={asset_data["symbol"]}&apikey={api_key}'
    # r = requests.get(url)
    # data = r.json()
    # market_price = data["Global Quote"]["05. price"]
    # rounded_market_price = round(float(market_price), 2)

    asset_data['market_price'] = rounded_market_price
    asset_dict[asset.id] = asset_data

  print('--------------Get All Assets--------------')
  return asset_dict

# Get one asset
@asset_routes.route('/<int:id>')
@login_required
def one_asset(id):

  asset = Asset.query.get(id)

  assetDict = asset.to_dict()

  # Need to fetch data from a new API
  # websocket api?

  url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={assetDict["symbol"]}&interval=1min&apikey={api_key}'
  r = requests.get(url)
  data = r.json()
  market_price = data["Time Series (1min)"][list(data["Time Series (1min)"].keys())[0]]["4. close"]

  # url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={assetDict["symbol"]}&apikey={api_key}'
  # r = requests.get(url)
  # data = r.json()
  # market_price = data["Global Quote"]["05. price"]


  rounded_market_price = round(float(market_price), 2)

  assetDict['market_price'] = rounded_market_price

  print('--------------Get One Asset--------------')
  return assetDict

# Create an asset
@asset_routes.route('', methods=['POST'])
@login_required
def create_asset():

  form = BuyForm()

  # Need to fetch data from a new API
  # websocket api?

  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():

    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={form.data["symbol"]}&interval=1min&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    cost = data["Time Series (1min)"][list(data["Time Series (1min)"].keys())[0]]["4. close"]
    rounded_market_price = round(float(cost), 2)

    # url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={form.data["symbol"]}&apikey={api_key}'
    # r = requests.get(url)
    # data = r.json()
    # market_price = data["Global Quote"]["05. price"]
    # rounded_market_price = round(float(market_price), 2)

    new_asset = Asset(
      user_id=current_user.id,
      symbol=form.data['symbol'],
      average_cost=rounded_market_price,
      shares=form.data['shares']
    )

    db.session.add(new_asset)
    db.session.commit()

    print('--------------Create Asset--------------')
    print(new_asset.to_dict())
    return new_asset.to_dict()

# Update an asset
@asset_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_asset(id):

  # Need to fetch data from a new API
  # yahoo finance api?

  asset = Asset.query.get(id)
  form = UpdateForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    asset.average_cost = form.data['average_cost']
    asset.shares = form.data['shares']
    db.session.commit()

    assetDict = asset.to_dict()

    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={assetDict["symbol"]}&interval=1min&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    market_price = data["Time Series (1min)"][list(data["Time Series (1min)"].keys())[0]]["4. close"]

    # url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={assetDict["symbol"]}&apikey={api_key}'
    # r = requests.get(url)
    # data = r.json()
    # market_price = data["Global Quote"]["05. price"]


    rounded_market_price = round(float(market_price), 2)

    assetDict['market_price'] = rounded_market_price

    print('--------------Update Asset--------------')
    return assetDict

# Delete an asset
@asset_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_asset(id):
  asset = Asset.query.get(id)
  deleted_asset = asset.to_dict()
  db.session.delete(asset)
  db.session.commit()

  print('--------------Delete Asset--------------')
  return deleted_asset
