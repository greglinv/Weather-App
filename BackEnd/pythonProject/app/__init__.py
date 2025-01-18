from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from .models import db
import os

def create_app():
    load_dotenv('api.env')  # Load environment variables
    app = Flask(__name__)
    CORS(app)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change_me_in_prod")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///weather_app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    jwt = JWTManager(app)

    with app.app_context():
        db.create_all()  # Create tables if they don't exist

    from .routes import weather_routes
    from .auth import auth

    app.register_blueprint(weather_routes)
    app.register_blueprint(auth, url_prefix="/auth")

    return app

