import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../auth";

const Favorites = () => {
    const [cities, setCities] = useState([]);
    const token = getToken();

    useEffect(() => {
        if (!token) return;
        axios
            .get("http://localhost:5000/favorites", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => setCities(res.data.favorites))
            .catch(console.error);
    }, [token]);

    const removeCity = (city) => {
        axios
            .delete(`http://localhost:5000/favorites/${city}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(res => setCities(res.data.favorites))
            .catch(console.error);
    };

    return (
        <div className="container my-4">
            <h2>Your Favorites</h2>
            {cities.length === 0
                ? <p>No favorite cities yet.</p>
                : (
                    <ul className="list-group">
                        {cities.map(city => (
                            <li key={city} className="list-group-item d-flex justify-content-between align-items-center">
                                {city}
                                <button className="btn btn-sm btn-danger" onClick={() => removeCity(city)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
};

export default Favorites;
