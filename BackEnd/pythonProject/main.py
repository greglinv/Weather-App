# weather_app.py
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv('api.env')

app = Flask(__name__)
CORS(app)  # Enable CORS

API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

@app.before_request
def log_request():
    print(f"Request received: {request.url}")

@app.route("/weather", methods=["GET"])
def get_weather():
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
        summary = {
            "city": data["name"],
            "temperature_kelvin": data["main"]["temp"],
            "temperature_celsius": round(data["main"]["temp"] - 273.15, 2),
            "temperature_fahrenheit": round((data["main"]["temp"] - 273.15) * 9 / 5 + 32, 2),
            "weather": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"],
            "pressure": data["main"]["pressure"]
        }
        return jsonify(summary), 200
    else:
        return jsonify({"error": "Failed to fetch weather"}), response.status_code

@app.route("/forecast", methods=["GET"])
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

if __name__ == "__main__":
    app.run(debug=True)
