from app.models import db, List, environment, SCHEMA
from sqlalchemy.sql import text

def seed_lists():
    housework = List(name='Housework', user_id=1)
    random = List(name='Random', user_id=1)
    school = List(name='School', user_id=2)
    church = List(name='Church', user_id=2)
    tutorial = List(name='Tutorial', user_id=1)
    personal = List(name='Personal', user_id=1)
    work = List(name='Work', user_id=1)
    empty = List(name='Empty List', user_id=1)

    seed_lists = [housework, random, school, church, tutorial, personal, work, empty]

    [db.session.add(list) for list in seed_lists]

    db.session.commit()


def undo_lists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.lists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM lists"))

    db.session.commit()
