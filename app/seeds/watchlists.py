from app.models import db, Watchlist, environment, SCHEMA
from sqlalchemy.sql import text

def seed_watchlists():
  watchlist1 = Watchlist(name='Tech', number_of_stocks=3, user_id=2)
  watchlist2 = Watchlist(name='Finance', number_of_stocks=2, user_id=2)
  watchlist3 = Watchlist(name='Retail', number_of_stocks=1, user_id=3)
  watchlist4 = Watchlist(name='Tech', number_of_stocks=3, user_id=3)
  watchlist5 = Watchlist(name='Business', number_of_stocks=2, user_id=3)

  seed_watchlists = [watchlist1, watchlist2, watchlist3, watchlist4, watchlist5]

  [db.session.add(watchlist) for watchlist in seed_watchlists]

  db.session.commit()

def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))

    db.session.commit()
