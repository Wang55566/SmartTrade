from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Asset(db.Model):
      
      __tablename__ = 'assets'

      if environment == "production":
            __table_args__ = {'schema': SCHEMA}

      id = db.Column(db.Integer, primary_key=True)
      symbol = db.Column(db.String(15), nullable=False, unique=True)
      market_price = db.Column(db.Float)
      average_cost = db.Column(db.Float, nullable=False)
      shares = db.Column(db.Integer, nullable=False)
      created_at = db.Column(db.DateTime, default=datetime.now())
      updated_at = db.Column(db.DateTime, default=datetime.now())

      user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

      user = db.relationship('User', back_populates='assets')
