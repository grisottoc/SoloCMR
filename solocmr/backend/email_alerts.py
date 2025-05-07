from flask import current_app
from flask_mail import Message
from datetime import datetime
from models import db, User, Client, NotificationPreference

def send_email(to, subject, body):
    from app import mail  # ✅ Import inside the function to avoid circular import
    msg = Message(subject, sender=current_app.config['MAIL_USERNAME'], recipients=[to])
    msg.body = body
    mail.send(msg)

def process_email_alerts():
    today = datetime.now().date()
    users = User.query.all()

    for user in users:
        prefs = user.preferences
        clients = Client.query.filter_by(user_id=user.id).all()

        for client in clients:
            try:
                due_date = datetime.strptime(client.due_date, "%Y-%m-%d").date()
            except ValueError:
                continue

            days_diff = (due_date - today).days

            if client.id in prefs.snoozed or client.id in prefs.completed:
                continue

            if days_diff == prefs.days_before_due:
                send_email(user.email, f"Upcoming Due Date for {client.name}", f"Client '{client.name}' is due in {days_diff} day(s).")
            elif days_diff == 0:
                send_email(user.email, f"Client Due Today: {client.name}", "Don't forget, this client is due today.")
            elif days_diff < 0:
                send_email(user.email, f"Overdue Client: {client.name}", "This client's due date has passed.")
