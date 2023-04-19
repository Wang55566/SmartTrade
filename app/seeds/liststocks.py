from app.models import db, ListStock, environment, SCHEMA
from sqlalchemy.sql import text

def seed_liststocks():
  # Watchlist 1
  liststock1 = ListStock(watchlist_id=1, symbol='AAPL')
  liststock2 = ListStock(watchlist_id=1, symbol='AMZN')
  liststock3 = ListStock(watchlist_id=1, symbol='GOOG')
  # Watchlist 2
  liststock4 = ListStock(watchlist_id=2, symbol='V')
  liststock5 = ListStock(watchlist_id=2, symbol='JPM')
  # Watchlist 3
  liststock6 = ListStock(watchlist_id=3, symbol='WMT')
  # Watchlist 4
  liststock7 = ListStock(watchlist_id=4, symbol='TSLA')
  liststock8 = ListStock(watchlist_id=4, symbol='AMZN')
  liststock9 = ListStock(watchlist_id=4, symbol='MSFT')
  # Watchlist 5
  liststock10 = ListStock(watchlist_id=5, symbol='GOOG')
  liststock11 = ListStock(watchlist_id=5, symbol='TCEHY')

  db.session.add(liststock1)
  db.session.add(liststock2)
  db.session.add(liststock3)
  db.session.add(liststock4)
  db.session.add(liststock5)
  db.session.add(liststock6)
  db.session.add(liststock7)
  db.session.add(liststock8)
  db.session.add(liststock9)
  db.session.add(liststock10)
  db.session.add(liststock11)

  db.session.commit()

def undo_liststocks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.liststocks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM liststocks"))

    db.session.commit()
