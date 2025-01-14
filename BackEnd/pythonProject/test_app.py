import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.testing = True
    return app.test_client()

def test_get_weather_valid_city(client):
    response = client.get("/weather?city=New York")
    assert response.status_code == 200
    data = response.get_json()
    assert "city" in data and data["city"] == "New York"
    assert "temperature_celsius" in data
    assert "weather" in data

def test_get_weather_invalid_city(client):
    response = client.get("/weather?city=InvalidCityName")
    assert response.status_code == 404
    data = response.get_json()
    assert "error" in data and data["error"] == "City not found"

def test_get_weather_default_city(client):
    response = client.get("/weather")
    assert response.status_code == 200
    data = response.get_json()
    assert "city" in data and data["city"] == "London"  # Default city
    assert "temperature_celsius" in data
    assert "weather" in data
