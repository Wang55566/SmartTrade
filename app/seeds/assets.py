from app.models import db, Asset, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_assets():
    asset1 = Asset(
        symbol='TSLA', shares=20, user_id=1, average_cost=150)

    db.session.add(asset1)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_assets():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.assets RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM assets"))

    db.session.commit()
