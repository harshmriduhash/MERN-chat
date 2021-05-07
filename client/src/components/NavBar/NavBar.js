import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

import { useAuth } from "../../contexts/AuthProvider";

const NavBar = () => {
  const { signout } = useAuth();

  const handleSignout = () => signout();

  return (
    <Navbar
      style={{ height: "10vh" }}
      collapseOnSelect
      expand="lg"
      bg="primary"
      variant="dark"
    >
      <Navbar.Brand>ChatNow!</Navbar.Brand>
      <div className="mr-auto" />
      <Button variant="outline-light" type="button" onClick={handleSignout}>
        Sign Out
      </Button>
    </Navbar>
  );
};

export default NavBar;
