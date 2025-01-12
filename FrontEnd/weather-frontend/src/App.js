// src/App.js
import React from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import Login from "./components/Login";
import Register from "./components/Register";

import "./App.css";

ReactDOM.render(<App />, document.getElementById("root"));

function App() {
  return (
    <Router>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <div className="container my-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <Weather />
                    </div>
                    <div className="col-md-6 mb-3">
                      <Forecast />
                    </div>
                  </div>
                </div>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
