// src/App.js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Header from "./components/Header";
import FavoritesDashboard from "./components/FavoritesDashboard";
import Weather from "./components/Weather";
import Forecast from "./components/Forecast";
import Login from "./components/Login";
import Register from "./components/Register";
import Settings from "./components/Settings";
import Favorites from "./components/Favorites";

import "./App.css";

ReactDOM.render(<App />, document.getElementById("root"));

function App() {
    const [selectedCity, setSelectedCity] = useState("");
    const [favoriteTrigger, setFavoriteTrigger] = useState(0);

    // Increment trigger to refresh the favorites dashboard
    const handleFavoriteAdded = () => {
        setFavoriteTrigger(prev => prev + 1);
    };

    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Header />

                    {/* Favorites bar under the header, reloads on trigger */}
                    <FavoritesDashboard
                        onSelectCity={setSelectedCity}
                        reloadTrigger={favoriteTrigger}
                    />

                    <main>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <div className="container my-4">
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                {/* Pass selectedCity and update callback */}
                                                <Weather
                                                    defaultCity={selectedCity}
                                                    onFavoriteAdded={handleFavoriteAdded}
                                                />
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
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="*" element={<h2>Page Not Found</h2>} />
                        </Routes>
                    </main>

                    <footer className="App-footer">
                        <p>© 2024 Gregory's Weather App</p>
                    </footer>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
