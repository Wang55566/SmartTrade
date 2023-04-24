from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Watchlist(db.Model):

      __tablename__ = 'watchlists'

      if environment == "production":
            __table_args__ = {'schema': SCHEMA}

      id = db.Column(db.Integer, primary_key=True)
      name = db.Column(db.String(50), nullable=False)
      number_of_stocks = db.Column(db.Integer, nullable=False , default=0)
      created_at = db.Column(db.DateTime, default=datetime.now())
      updated_at = db.Column(db.DateTime, default=datetime.now())

      user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

      user = db.relationship('User', back_populates='watchlists')
      liststocks = db.relationship('ListStock', back_populates='watchlist', cascade='all, delete-orphan')
