import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { getToken, removeToken } from "../auth";
import { UserContext } from "../context/UserContext";

const Header = () => {
  // Pull out username & setUsername from the UserContext
  const { username, setUsername, fetchUsername } = useContext(UserContext);

  // (Optional) If you ever need to re-fetch user data, you can call fetchUsername(getToken())

  const handleLogout = () => {
    removeToken();
    setUsername(null); // Clear the local user context
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
