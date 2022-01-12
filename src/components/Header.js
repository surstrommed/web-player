import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { CAuth } from "../pages/Auth";
import { history } from "./../App";

export const Header = () => {
  return (
    <Navbar
      className="Header"
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
    >
      <Container>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto d-flex mx-auto">
            <Button className="btn-circle" onClick={() => history.goBack()}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </Button>
            <Button className="btn-circle" onClick={() => history.goForward()}>
              <FontAwesomeIcon icon={faArrowRight} />
            </Button>
          </Nav>
          <Nav>
            <CAuth />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
