from flask import Blueprint, request, jsonify
import requests
import os
from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import User

weather_routes = Blueprint('weather_routes', __name__)

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@weather_routes.before_request
def log_request():
    print(f"Request received: {request.url}")

@weather_routes.route("/weather", methods=["GET"])
@jwt_required(optional=True)  # <-- ALLOWS logged in or anon
def get_weather():
    current_user = get_jwt_identity()
    city = request.args.get("city", default="London")
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}"
    response = requests.get(url)

    if response.status_code == 404:
        return jsonify({"error": "City not found"}), 404
    elif response.status_code == 401:
        return jsonify({"error": "Invalid API key"}), 401
    elif response.status_code == 429:
        return jsonify({"error": "API rate limit exceeded"}), 429

    if response.status_code == 200:
        data = response.json()

        # Convert from Kelvin
        kelvin_temp = data["main"]["temp"]
        celsius_temp = round(kelvin_temp - 273.15, 2)
        fahrenheit_temp = round((kelvin_temp - 273.15) * 9 / 5 + 32, 2)

        # Default unit to 'celsius' if user is not logged in
        preferred_unit = "celsius"
        if current_user:
            user = User.query.filter_by(username=current_user).first()
            if user and user.unit_preference == "fahrenheit":
                preferred_unit = "fahrenheit"

        summary = {
            "city": data["name"],
            "temperature_kelvin": kelvin_temp,
            "temperature_celsius": celsius_temp,
            "temperature_fahrenheit": fahrenheit_temp,
            "preferred_unit": preferred_unit,
            "weather": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "pressure": data["main"]["pressure"]
        }
        return jsonify(summary), 200
    else:
        return jsonify({"error": "Failed to fetch weather"}), response.status_code


@weather_routes.route("/forecast", methods=["GET"])
def get_forecast():
    city = request.args.get("city", default="London")
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        forecast = [
            {
                "date": entry["dt_txt"],
                "temperature_celsius": round(entry["main"]["temp"] - 273.15, 2),
                "weather": entry["weather"][0]["description"]
            }
            for entry in data["list"]
        ]
        return jsonify({"city": data["city"]["name"], "forecast": forecast}), 200
    else:
        return jsonify({"error": "Failed to fetch forecast"}), response.status_code
