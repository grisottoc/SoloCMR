from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from models import db, User, Client, NotificationSetting

app = Flask(__name__)
app.config.from_object('config')  # Ensure config has your DB and email settings
db.init_app(app)

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = "your_email@gmail.com"
SMTP_PASSWORD = "your_password"

def send_email(to, subject, body):
    msg = MIMEText(body)
    msg['From'] = SMTP_USERNAME
    msg['To'] = to
    msg['Subject'] = subject

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_USERNAME, to, msg.as_string())

def parse_ids(ids_string):
    return set(map(int, filter(None, ids_string.split(','))))

with app.app_context():
    today = datetime.today().date()
    users = User.query.all()

    for user in users:
        setting = user.notification_settings
        if not setting:
            continue

        custom_days = list(map(int, setting.custom_days_before.split(",")))
        snoozed = parse_ids(setting.snoozed_ids)
        completed = parse_ids(setting.completed_ids)

        for client in user.clients:
            if client.id in snoozed or client.id in completed:
                continue

            due_date = datetime.strptime(client.due_date, "%Y-%m-%d").date()
            days_diff = (due_date - today).days

            subject = None
            body = None

            if days_diff == 0:
                subject = f"📌 {client.name} is due today"
                body = f"{client.name}'s task is due today!"
            elif days_diff < 0:
                subject = f"❗ {client.name} is OVERDUE!"
                body = f"{client.name}'s task was due on {client.due_date}. Please follow up."
            elif days_diff in custom_days:
                subject = f"⏰ Reminder: {client.name} due in {days_diff} day(s)"
                body = f"{client.name}'s task is coming up on {client.due_date}."

            if subject and body:
                send_email(user.email, subject, body)
