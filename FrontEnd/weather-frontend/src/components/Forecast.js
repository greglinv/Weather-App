// src/components/Forecast.js
import React, { useState } from "react";
import axios from "axios";
import { getToken } from "../auth";

const Forecast = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const fetchForecast = async () => {
    try {
      const token = getToken();
      const response = await axios.get("http://localhost:5000/forecast", {
        headers: { Authorization: `Bearer ${token}` },
        params: { city },
      });
      setForecastData(response.data);
      setError("");
    } catch (err) {
      setForecastData(null);
      setError(err.response?.data.error || "Something went wrong");
    }
  };

  return (
    <div className="container my-4">
      <h2>Forecast</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={fetchForecast}
            >
              Get Forecast
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {forecastData && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{forecastData.city}</h5>
                <ul className="list-group list-group-flush">
                  {forecastData.forecast.map((day, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{day.date}:</strong> {day.temperature_celsius}°C, {day.weather}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forecast;
