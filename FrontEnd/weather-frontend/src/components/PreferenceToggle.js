// src/components/PreferenceToggle.js
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { getToken } from "../auth";
import { UserContext } from "../context/UserContext";

const PreferenceToggle = () => {
  // Pull the user object and fetchUserData
  const { user, setUser, fetchUserData } = useContext(UserContext);

  const [selectedPreference, setSelectedPreference] = useState(
    user?.unit_preference || "celsius"
  );


  useEffect(() => {
    if (user && user.unit_preference) {
      setSelectedPreference(user.unit_preference);
    }
  }, [user]);

  const handlePreferenceChange = async (newPref) => {
    // Update local state immediately so the UI toggles
    setSelectedPreference(newPref);

    if (!user) {
      console.log("Must be logged in to change preference!");
      return;
    }

    try {
      // Make a PATCH request to update preference
      const token = getToken();
      if (!token) {
        console.log("No valid token found.");
        return;
      }

      await axios.patch(
        "http://localhost:5000/auth/preference",
        { unit_preference: newPref },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After successfully updating the preference
      await fetchUserData(token);
    } catch (err) {
      console.error("Error updating preference:", err.response?.data || err.message);
    }
  };

  // If user is not logged in disable or hide the toggle
  if (!user) {
    return (
      <p>Please <a href="/login">login</a> to change your unit preference.</p>
    );
  }

  return (
    <div>
      <h5>Unit Preference</h5>
      <div>
        <label>
          <input
            type="radio"
            name="preference"
            value="celsius"
            checked={selectedPreference === "celsius"}
            onChange={() => handlePreferenceChange("celsius")}
          />
          Celsius
        </label>

        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="preference"
            value="fahrenheit"
            checked={selectedPreference === "fahrenheit"}
            onChange={() => handlePreferenceChange("fahrenheit")}
          />
          Fahrenheit
        </label>
      </div>
    </div>
  );
};

export default PreferenceToggle;
