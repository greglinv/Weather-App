// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg(""); // Clear any old messages

    try {
      const response = await axios.post("http://localhost:5000/auth/register", {
        username,
        password,
      });
      setMsg(response.data.message || "Registration successful!");
    } catch (err) {
      setMsg(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Username:{" "}</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:{" "}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
