from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    notification_settings = db.relationship('NotificationSetting', backref='user', uselist=False)
    clients = db.relationship('Client', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    service = db.Column(db.String(100))
    notes = db.Column(db.Text)
    due_date = db.Column(db.String(30))

class NotificationSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    custom_days_before = db.Column(db.String(50), default="1,2,3")
    snoozed_ids = db.Column(db.String(200), default="")
    completed_ids = db.Column(db.String(200), default="")

class NotificationPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    days_before = db.Column(db.Integer, default=2)
    snoozed = db.Column(db.Boolean, default=False)
    completed = db.Column(db.Boolean, default=False)

    user = db.relationship('User', backref=db.backref('notification_preferences', lazy=True))
