import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { getToken, removeToken } from "../auth";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    removeToken();
    setUser(null);
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
            {!user ? (
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
                {/* Here’s the Settings link, only shown if logged in */}
                <Nav.Link as={Link} to="/settings">
                  Settings
                </Nav.Link>
                
                <Navbar.Text className="me-2">
                  Welcome, {user.username}
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
