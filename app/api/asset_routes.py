from flask import Blueprint, jsonify, request
from app.models import db, User, Asset
from flask_login import current_user, login_required
from .auth_routes import validation_errors_to_error_messages


asset_routes = Blueprint('assets', __name__)

# Get all assets
@asset_routes.route('')
@login_required
def all_assets():
    assets = Asset.query.all()
    return {'assets': [asset.to_dict() for asset in assets]}

# Get one asset
@asset_routes.route('/<int:id>')
@login_required
def one_asset(id):
    asset = Asset.query.get(id)
    return asset.to_dict()

# Create an asset
@asset_routes.route('', methods=['POST'])
@login_required
def create_asset():
  form = AssetForm()
  form['csrf_token'].data = request.cookies['csrf_token']
  if form.validate_on_submit():
    new_asset = Asset(
      user_id=current_user.id,
      symbol=form.data['symbol'],
      average_cost=form.data['average_cost'],
      shares=form.data['shares']
    )
    db.session.add(asset)
    db.session.commit()
    return asset.to_dict()
