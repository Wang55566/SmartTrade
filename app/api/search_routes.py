from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages

from app.forms import BuyForm, UpdateForm

import requests
import os

search_routes = Blueprint('search', __name__)

api_key = os.environ.get('API_KEY')

# Get Search Results
@search_routes.route('/<string:search>')
@login_required
def search_results(search):

  url = f'https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords={search}&apikey={api_key}'
  r = requests.get(url)
  data = r.json()

  print('--------------Search Results--------------', data)
  return data
