// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate(); // <-- React Router hook

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
        // Store the token
        setToken(access_token);
        setMsg("Login successful!");
        // Redirect to main page
        navigate("/");
      }
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleLogin}>
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

        {/* Example button styling with inline CSS */}
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            marginTop: "10px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
