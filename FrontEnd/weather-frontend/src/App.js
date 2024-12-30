import React from "react";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import './App.css'; // Ensure this import is present

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>
      </header>
      <main>
        <Weather />
        <Forecast />
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 Gregory's Weather App</p>
      </footer>
    </div>
  );
}

export default App;
