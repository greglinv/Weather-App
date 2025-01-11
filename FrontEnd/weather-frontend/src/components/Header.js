// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, removeToken } from "../auth";
import axios from "axios";

const Header = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // If there's a token, try to fetch user info (or decode token) to get the username
    const token = getToken();
    if (token) {
      // For simplicity, let's do a request to a protected endpoint
      // that returns the current username.
      axios
        .get("http://localhost:5000/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // The protected endpoint might respond with something like:
          // { "message": "Hello, john! You have accessed a protected route." }
          // or you could have an endpoint that returns { username: "john" }
          // For demo, let's just parse the message to extract the username
          const text = res.data.message; // e.g. "Hello, john! You have accessed..."
          const extracted = text.match(/Hello, (.+)!/);
          if (extracted) {
            setUsername(extracted[1]);
          }
        })
        .catch((err) => {
          console.log("Error fetching user info", err);
          // If token invalid, remove it
          removeToken();
        });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setUsername(null);
  };

  return (
    <header className="App-header">
      <h1>Weather App</h1>
      <nav>
        {!username ? (
          <>
            <Link to="/login" style={{ marginRight: "1rem" }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: "1rem" }}>Welcome, {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
