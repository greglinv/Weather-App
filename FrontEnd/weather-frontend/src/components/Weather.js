import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../auth";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:5000/weather", {
        headers: { Authorization: `Bearer ${token}` },
        params: { city },
      });

      if (response.data.error) {
        setError(response.data.error);
        setWeatherData(null);
      } else {
        setWeatherData(response.data);
        setError("");
      }
    } catch (err) {
      setWeatherData(null);
      setError("Something went wrong. Please try again.");
    }
  };

  // The key part is adding onKeyDown below:
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="container my-4">
      <h2>Weather</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={handleKeyDown}  //  Bind the Enter key event
            />
            <button 
              className="btn btn-primary"
              onClick={fetchWeather}
            >
              Get Weather
            </button>
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{weatherData.city}</h5>
                <p className="card-text">
                  <strong>Temperature:</strong> {weatherData.temperature_celsius}°C <br />
                  <strong>Weather:</strong> {weatherData.weather} <br />
                  <strong>Humidity:</strong> {weatherData.humidity}% <br />
                  <strong>Wind Speed:</strong> {weatherData.wind_speed} m/s
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Weather;
