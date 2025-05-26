from flask import current_app
from flask_mail import Message
from datetime import datetime
from models import db, User, Client, NotificationSetting

def send_email(to, subject, body):
    mail = current_app.extensions.get("mail")  # avoids circular import
    if not mail:
        raise RuntimeError("Flask-Mail not initialized")
    msg = Message(subject, sender=current_app.config['MAIL_USERNAME'], recipients=[to])
    msg.body = body
    mail.send(msg)

def parse_id_string(id_string):
    try:
        return set(int(i) for i in id_string.split(",") if i)
    except ValueError:
        return set()

def parse_day_string(day_string):
    try:
        return set(int(i) for i in day_string.split(",") if i)
    except ValueError:
        return {1, 2}

def process_email_alerts():
    today = datetime.now().date()
    users = User.query.all()

    for user in users:
        setting = user.notification_settings
        if not setting:
            continue

        snoozed_ids = parse_id_string(setting.snoozed_ids)
        completed_ids = parse_id_string(setting.completed_ids)
        days_before_set = parse_day_string(setting.custom_days_before)

        clients = Client.query.filter_by(user_id=user.id).all()

        for client in clients:
            try:
                due_date = datetime.strptime(client.due_date, "%Y-%m-%d").date()
            except ValueError:
                continue

            days_diff = (due_date - today).days

            if client.id in snoozed_ids or client.id in completed_ids:
                continue

            if days_diff in days_before_set:
                send_email(user.email, f"Upcoming Due Date for {client.name}",
                           f"Client '{client.name}' is due in {days_diff} day(s).")
            elif days_diff == 0:
                send_email(user.email, f"Client Due Today: {client.name}",
                           "Don't forget, this client is due today.")
            elif days_diff < 0:
                send_email(user.email, f"Overdue Client: {client.name}",
                           "This client's due date has passed.")
