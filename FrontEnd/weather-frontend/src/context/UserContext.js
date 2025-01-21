import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../auth';

// Create the context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);

  // Helper to fetch the username (via the protected route) given a token
  const fetchUsername = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/auth/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = res.data.message || "";
      const match = text.match(/Hello, (.+)!/);
      if (match) {
        setUsername(match[1]);
      }
    } catch (err) {
      // If something goes wrong, remove the token and clear username
      removeToken();
      setUsername(null);
    }
  };

  // On first load, if there is already a token, fetch the username
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUsername(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, fetchUsername }}>
      {children}
    </UserContext.Provider>
  );
};
