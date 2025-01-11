// src/App.js
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <main style={{ padding: "1rem" }}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Weather />
                  <Forecast />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Optionally add a 404 catch-all route */}
            <Route path="*" element={<h2>Page Not Found</h2>} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>&copy; 2024 Gregory's Weather App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
