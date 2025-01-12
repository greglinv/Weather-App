// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username,
        password,
      });
      const { access_token } = response.data;
      if (access_token) {
        setToken(access_token);
        setMsg("Login successful!");
        navigate("/");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "400px" }}>
      <h2>Login</h2>
      {msg && (
        <div className="alert alert-info" role="alert">
          {msg}
        </div>
      )}
      <form onSubmit={handleLogin}>
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
