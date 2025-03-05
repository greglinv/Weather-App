from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate  # <-- NEW IMPORT
from dotenv import load_dotenv
from .models import db
import os

# Create a global Migrate instance
migrate = Migrate()

def create_app():
    load_dotenv('api.env')  # Load environment variables
    app = Flask(__name__)
    CORS(app)

    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change_me_in_prod")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///weather_app.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize the database with the app
    db.init_app(app)

    # Initialize Flask-Migrate with the app and db
    migrate.init_app(app, db)

    # Initialize JWT manager
    jwt = JWTManager(app)

    from .routes import weather_routes
    from .auth import auth
    app.register_blueprint(weather_routes)
    app.register_blueprint(auth, url_prefix="/auth")

    return app
