// src/components/Register.js
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
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
    <div className="container my-4" style={{ maxWidth: "400px" }}>
      <h2>Register</h2>
      {msg && (
        <div className="alert alert-info" role="alert">
          {msg}
        </div>
      )}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
