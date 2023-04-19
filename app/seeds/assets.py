from app.models import db, Asset, environment, SCHEMA
from sqlalchemy.sql import text

def seed_assets():
  asset1 = Asset(symbol='AAPL', average_cost=188.00, shares=10, user_id=1)
  asset2 = Asset(symbol='AMZN', average_cost=2500.00, shares=5, user_id=1)
  asset3 = Asset(symbol='GOOG', average_cost=1000.00, shares=6, user_id=1)
  asset4 = Asset(symbol='MSFT', average_cost=133.00, shares=20, user_id=2)
  asset5 = Asset(symbol='TSLA', average_cost=190.00, shares=7, user_id=2)

  db.session.add(asset1)
  db.session.add(asset2)
  db.session.add(asset3)
  db.session.add(asset4)
  db.session.add(asset5)

  db.session.commit()

def undo_assets():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.assets RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM assets"))

    db.session.commit()
