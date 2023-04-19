from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class ListStock(db.Model):

      __tablename__ = 'liststocks'

      if environment == "production":
            __table_args__ = {'schema': SCHEMA}

      id = db.Column(db.Integer, primary_key=True)
      symbol = db.Column(db.String(15), nullable=False)
      market_price = db.Column(db.Float)
      created_at = db.Column(db.DateTime, default=datetime.now())
      updated_at = db.Column(db.DateTime, default=datetime.now())

      watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('watchlists.id')))

      watchlist = db.relationship('Watchlist', back_populates='liststocks')
