// src/components/Weather.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken } from "../auth";

const Weather = ({ defaultCity = "", onFavoriteAdded }) => {
    const [city, setCity] = useState(defaultCity);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");

    // Fetch weather data for a given city (param takes precedence)
    const fetchWeather = async (cityToFetch) => {
        const queryCity = cityToFetch || city;
        try {
            const token = getToken();
            const config = { params: { city: queryCity } };
            if (token) {
                config.headers = { Authorization: `Bearer ${token}` };
            }

            const response = await axios.get(
                "http://localhost:5000/weather",
                config
            );

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

    // When defaultCity prop changes, update input and fetch immediately
    useEffect(() => {
        if (defaultCity && defaultCity !== city) {
            setCity(defaultCity);
            fetchWeather(defaultCity);
        }
    }, [defaultCity]);

    // Add current city to favorites and notify parent
    const addFavorite = async () => {
        const token = getToken();
        if (!token) {
            return alert("Please log in to save favorites.");
        }
        try {
            await axios.post(
                "http://localhost:5000/favorites",
                { city },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`${city} added to favorites!`);
            onFavoriteAdded?.();
        } catch (err) {
            console.error(err);
            alert("Couldn’t add favorite. Try again.");
        }
    };

    // Allow pressing Enter to trigger the fetch
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            fetchWeather();
        }
    };

    // Decide which temperature to show
    let displayedTemperature = null;
    if (weatherData) {
        if (weatherData.preferred_unit === "fahrenheit") {
            displayedTemperature = `${weatherData.temperature_fahrenheit} °F`;
        } else {
            displayedTemperature = `${weatherData.temperature_celsius} °C`;
        }
    }

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
                            onKeyDown={handleKeyDown}
                        />
                        <button className="btn btn-primary" onClick={() => fetchWeather()}>
                            Get Weather
                        </button>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    {weatherData && !error && (
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{weatherData.city}</h5>
                                <p className="card-text">
                                    <strong>Temperature:</strong> {displayedTemperature}<br />
                                    <strong>Weather:</strong> {weatherData.weather}<br />
                                    <strong>Humidity:</strong> {weatherData.humidity}%<br />
                                    <strong>Wind Speed:</strong> {weatherData.wind_speed} m/s
                                </p>
                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={addFavorite}
                                >
                                    Favorite+
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Weather;
