// src/components/FavoritesDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../auth';

// A horizontal bar of favorite-city mini-cards under the header
// onSelectCity: callback invoked when a card is clicked
const FavoritesDashboard = ({ onSelectCity, reloadTrigger }) => {
    const [favorites, setFavorites] = useState([]);
    const [weatherList, setWeatherList] = useState([]);
    const token = getToken();

    // Load favorites from the backend
    const loadFavorites = async () => {
        if (!token) return;
        try {
            const res = await axios.get('http://localhost:5000/favorites', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(res.data.favorites);
        } catch (err) {
            console.error('Error fetching favorites', err);
        }
    };

    // Load weather data for a list of cities
    const loadWeatherForFavorites = async (cities) => {
        try {
            const data = await Promise.all(
                cities.map(async city => {
                    const res = await axios.get('http://localhost:5000/weather', {
                        params: { city },
                        headers: token ? { Authorization: `Bearer ${token}` } : {}
                    });
                    return res.data;
                })
            );
            setWeatherList(data);
        } catch (err) {
            console.error('Error fetching weather for favorites', err);
        }
    };

    // On mount and when token or reload trigger changes, load favorites
    useEffect(() => {
        loadFavorites();
    }, [token, reloadTrigger]);

    // Whenever favorites change, fetch their weather
    useEffect(() => {
        if (favorites.length) {
            loadWeatherForFavorites(favorites);
        } else {
            setWeatherList([]);
        }
    }, [favorites, token]);

    // Refresh the entire favorites list and weather data
    const refreshAll = () => {
        loadFavorites();
    };

    // Refresh a single city's weather
    const refreshCity = async (city) => {
        try {
            const res = await axios.get('http://localhost:5000/weather', {
                params: { city },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setWeatherList(prev => prev.map(w => w.city === city ? res.data : w));
        } catch (err) {
            console.error('Error refreshing', city, err);
        }
    };

    // Auto-refresh favorites every 5 minutes (300,000 ms)
    useEffect(() => {
        const intervalId = setInterval(() => {
            refreshAll();
        }, 300000);
        return () => clearInterval(intervalId);
    }, [token]);

    return (
        <div className="favorites-bar d-flex align-items-center overflow-auto bg-light p-3">
            {/* Manual refresh button */}
            <button
                className="btn btn-sm btn-primary me-2"
                onClick={refreshAll}
            >
                Refresh All
            </button>

            {weatherList.map(w => (
                <div
                    key={w.city}
                    className="card mx-2"
                    style={{ width: '150px', cursor: 'pointer' }}
                    onClick={() => onSelectCity?.(w.city)}
                >
                    <div className="card-body p-2 text-center">
                        <h6 className="card-title mb-1">{w.city}</h6>
                        <p className="card-text mb-2">{Math.round(w.temperature_celsius)}°C</p>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={e => { e.stopPropagation(); refreshCity(w.city); }}
                        >
                            ⟳
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FavoritesDashboard;
