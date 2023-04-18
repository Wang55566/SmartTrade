from app.models import db, environment, SCHEMA, Task
from sqlalchemy.sql import text

def seed_tasks():
    welcome = Task(name='Welcome', user_id=1, list_id=1)
    wash_car = Task(name='Wash Car', user_id=1, list_id=1)
    walk_dog = Task(name='Walk Dog', user_id=1)
    goodbye = Task(name='Goodbye', user_id=2, list_id=3)
    mop_floors = Task(name='Mop Floors', user_id=2, list_id=3)
    dust = Task(name='Dust', user_id=2)

    #tasks for tutorial list
    new_task = Task(name='Create a new task', user_id=1, list_id=5)
    new_list = Task(name='Create a new list', user_id=1, list_id=5)
    rename_task = Task(name='Rename a task', user_id=1, list_id=5, completed=True)
    rename_list = Task(name='Rename a list', user_id=1, list_id=5, completed=True)
    delete_task = Task(name='Delete a task', user_id=1, list_id=5)
    delete_list = Task(name='Delete a list', user_id=1, list_id=5)

    #tasks for personal list
    travel_hawaii = Task(name='Travel Plan for Hawaii', user_id=1, list_id=6)
    travel_japan = Task(name='Travel Plan for Japan', user_id=1, list_id=6)
    travel_korea = Task(name='Travel Plan for Korea', user_id=1, list_id=6, completed=True)

    seed_some_tasks = [welcome, wash_car, walk_dog, goodbye, mop_floors, dust]
    seed_tutorial_tasks = [new_task, new_list, rename_task, rename_list, delete_task, delete_list]
    seed_travel_tasks = [travel_hawaii, travel_japan, travel_korea]

    [db.session.add(task) for task in seed_some_tasks]
    [db.session.add(task) for task in seed_tutorial_tasks]
    [db.session.add(task) for task in seed_travel_tasks]
    db.session.commit()


def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tasks"))

    db.session.commit()
