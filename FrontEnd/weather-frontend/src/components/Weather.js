import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/weather`, {
        params: { city },
      });
      // Check if the response contains the required data
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
  

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>{weatherData.city}</h2>
          <p>Temperature: {weatherData.temperature_celsius}°C</p>
          <p>Weather: {weatherData.weather}</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.wind_speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
