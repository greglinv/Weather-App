// src/components/Login.js
import React, { useState, useContext } from "react";
import axios from "axios";
import { setToken } from "../auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Pull in the fetchUserData function from context
  const { fetchUserData } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        username: usernameInput,
        password,
      });
      const { access_token } = response.data;
      if (access_token) {
        // 1) Store the token
        setToken(access_token);

        // 2) Immediately fetch the user data (username, unit_preference) 
        //    from the server, which sets it in our Context state
        await fetchUserData(access_token);

        setMsg("Login successful!");

        // 3) Navigate to home
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
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
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
