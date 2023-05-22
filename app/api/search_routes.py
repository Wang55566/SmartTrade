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

  return data

# Get Result Details(market price)
@search_routes.route('/<string:symbol>/details')
@login_required
def result_details(symbol):

  # url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
  # r = requests.get(url)
  # data = r.json()
  url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={api_key}'
  r = requests.get(url)
  data = r.json()
  market_price = data["Time Series (1min)"][list(data["Time Series (1min)"].keys())[0]]["4. close"]
  rounded_market_price = round(float(market_price), 2)
  return {'roundedMarketPrice': rounded_market_price}

# Company Overview
@search_routes.route('/<string:symbol>/overview')
@login_required
def company_overview(symbol):

  url = f'https://www.alphavantage.co/query?function=OVERVIEW&symbol={symbol}&apikey={api_key}'
  r = requests.get(url)
  data = r.json()
  return data

# Company News
@search_routes.route('/<string:symbol>/news')
@login_required
def company_news(symbol):

  url = f'https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers={symbol}&apikey={api_key}'
  r = requests.get(url)
  data = r.json()
  return data

# Intraday Chart Data
@search_routes.route('/<string:symbol>/intraday')
@login_required
def daily_chart_data(symbol):

    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={api_key}'
    r = requests.get(url)
    data = r.json()
    return data

# Daily Chart Data
@search_routes.route('/<string:symbol>/daily')
@login_required
def daily_chart_data(symbol):

      url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={api_key}'
      r = requests.get(url)
      data = r.json()
      return data
