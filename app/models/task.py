from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Task(db.Model):

  __tablename__ = 'tasks'

  if environment == "production":
      __table_args__ = {'schema': SCHEMA}

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(255), nullable=False)
  due_date = db.Column(db.Date)
  completed = db.Column(db.Boolean, default=False)
  # list_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('lists.id')))
  # user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))
  created_at = db.Column(db.DateTime, default=datetime.now())

  # list = db.relationship(
  #     "List",
  #     back_populates="tasks"
  #   )
  # user = db.relationship(
  #     "User",
  #     back_populates="tasks"
  #   )

  def to_dict(self):
    return {
      'id': self.id,
      'name': self.name,
      'due_date': self.due_date ,
      'completed': self.completed ,
      'list_id': self.list_id,
      'user_id': self.user_id,
      'created_at': self.created_at
    }
