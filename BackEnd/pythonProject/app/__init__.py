from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

def create_app():
    load_dotenv('api.env')  # Load environment variables
    app = Flask(__name__)
    CORS(app)

    from .routes import weather_routes
    app.register_blueprint(weather_routes)

    return app
