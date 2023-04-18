from .db import db, environment, SCHEMA, add_prefix_for_prod

class List(db.Model):
    __tablename__ = 'lists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')))

    tasks = db.relationship(
            "Task",
            back_populates="list",
            cascade="all, delete-orphan"
    )
    user = db.relationship(
              "User",
              back_populates="lists"
      )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id
        }
