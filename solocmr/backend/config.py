import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    # JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    # JWT_REFRESH_TOKEN_EXPIRES = 86400  # 24 hours