import React, { useState } from "react";
import axios from "axios";

const Forecast = () => {
  const [city, setCity] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");

  const fetchForecast = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/forecast`, {
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
    <div>
      <h1>Forecast</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchForecast}>Get Forecast</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {forecastData && (
        <div>
          <h2>{forecastData.city}</h2>
          <ul>
            {forecastData.forecast.map((day, index) => (
              <li key={index}>
                <strong>{day.date}:</strong> {day.temperature_celsius}°C, {day.weather}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Forecast;
