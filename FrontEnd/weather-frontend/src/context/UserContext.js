// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, removeToken } from '../auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Helper function to fetch the user's info
  const fetchUserData = async (token) => {
    try {
      
      const res = await axios.get("http://localhost:5000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser({
        username: res.data.username,
        unit_preference: res.data.unit_preference
      });
    } catch (err) {
      // If something goes wrong, remove the token and clear user
      removeToken();
      setUser(null);
    }
  };

  // First load if there is a token fetch user info
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchUserData(token);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

