// src/components/Settings.js
import React from "react";
import PreferenceToggle from "./PreferenceToggle";

const Settings = () => {
  return (
    <div className="container">
      <h2>Settings</h2>
      <PreferenceToggle />
      {/* possibly more settings here */}
    </div>
  );
};

export default Settings;
