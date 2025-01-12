// src/components/Header.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getToken, removeToken } from "../auth";
import axios from "axios";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

const Header = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      axios
        .get("http://localhost:5000/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          // Suppose the server returns { "message": "Hello, john! ..." }
          const text = res.data.message || "";
          const match = text.match(/Hello, (.+)!/);
          if (match) setUsername(match[1]);
        })
        .catch(() => {
          removeToken();
        });
    }
  }, []);

  const handleLogout = () => {
    removeToken();
    setUsername(null);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Weather App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!username ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                <Navbar.Text className="me-2">
                  Welcome, {username}
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
