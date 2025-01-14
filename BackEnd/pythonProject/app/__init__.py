from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv('api.env')  # Load environment variables
    app = Flask(__name__)
    CORS(app)

    # Set a secret key for JWT
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change_me_in_prod")

    jwt = JWTManager(app)

    from .routes import weather_routes
    from .auth import auth

    # Register blueprints
    app.register_blueprint(weather_routes)
    app.register_blueprint(auth, url_prefix="/auth")

    return app
