import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";
import "./App.css";
import Routes from "./Routes";
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    navigate("/serverless-stack-client/login");
  }
  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    } catch (e) {
      if (e !== "No current user") {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }
  return (
    !isAuthenticating && (
      <div className="App container">
        <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
          <Navbar.Brand as={Link} to="/serverless-stack-client/">
            Scratch
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {isAuthenticated ? (
              <Nav className="ms-auto">
                <LinkContainer to="/serverless-stack-client/settings">
                  <Nav.Link
                    onClick={() =>
                      navigate("/serverless-stack-client/settings")
                    }
                  >
                    Settings
                  </Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </Nav>
            ) : (
              <Nav className="ms-auto">
                <LinkContainer to="/serverless-stack-client/signup">
                  <Nav.Link
                    onClick={() => navigate("/serverless-stack-client/signup")}
                  >
                    Signup
                  </Nav.Link>
                </LinkContainer>
                <LinkContainer to="/serverless-stack-client/login">
                  <Nav.Link
                    onClick={() => navigate("/serverless-stack-client/login")}
                  >
                    Login
                  </Nav.Link>
                </LinkContainer>
              </Nav>
            )}
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;
