from flask import Flask
from flask_cors import CORS
from db_config import db
from flask_jwt_extended import JWTManager
from config import Config
from flask_mail import Mail
from dotenv import load_dotenv
import os
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

load_dotenv()

app = Flask(__name__)
app.config.from_object(Config)

# Mail configuration
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER")
app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT", 587))
app.config['MAIL_USE_TLS'] = os.getenv("MAIL_USE_TLS", "True") == "True"
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

mail = Mail(app)  # ✅ Initialize here
CORS(app)
db.init_app(app)
jwt = JWTManager(app)

from models import User, Client, NotificationPreference
from routes import api
app.register_blueprint(api)

# ⏰ Schedule email alerts AFTER context is set up
with app.app_context():
    db.create_all()

    from email_alerts import process_email_alerts  # ✅ Import inside app context to avoid circular import

    scheduler = BackgroundScheduler()
    scheduler.add_job(
        func=process_email_alerts,
        trigger=IntervalTrigger(hours=24),
        id='email_alerts_job',
        name='Send email alerts daily',
        replace_existing=True
    )
    scheduler.start()

if __name__ == "__main__":
    app.run(debug=True)
