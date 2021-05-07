import React, { useState, useRef } from "react";

import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthProvider";

const UnauthenticatedApp = () => {
  const { signup, signin } = useAuth();

  const [isSignup, setIsSignup] = useState(true);
  const [inputError, setInputError] = useState("");

  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const verifyPasswordRef = useRef();

  const populateFields = () => {
    emailRef.current.value = "john.doe@email.com";
    passwordRef.current.value = "123456";
    if (isSignup) {
      firstNameRef.current.value = "John";
      lastNameRef.current.value = "Doe";
      usernameRef.current.value = "johndoe";
      verifyPasswordRef.current.value = "123456";
    }
  };

  // const printFormFields = () => {
  //   console.log("Email: " + emailRef.current?.value);
  //   console.log("Password: " + passwordRef.current?.value);

  //   if (!isSignup) {
  //     console.log("Verify Password: " + verifyPasswordRef.current?.value);
  //     console.log("First Name: " + firstNameRef.current?.value);
  //     console.log("Last Name: " + lastNameRef.current?.value);
  //     console.log("Username: " + usernameRef.current?.value);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInputError("");

    if (isSignup) {
      const errors = [];

      if (passwordRef.current.value !== verifyPasswordRef.current.value)
        errors.push("passwords do not match");

      if (passwordRef.current.value.length < 6)
        errors.push("password is less than 6 characters");

      if (errors.length) {
        setInputError(`Error: ${errors[0]}`);
        return;
      }
    }

    const formData = isSignup
      ? {
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
      : {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };

    let result = null;

    if (isSignup) {
      result = await signup(formData);
    } else {
      result = await signin(formData);
    }

    if (result.message) {
      setInputError(`Error: ${result.message}`);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Card body style={{ width: "25rem" }}>
        <Card.Title
          className="d-flex justify-content-center"
          style={{ fontSize: "1.75rem" }}
        >
          {isSignup ? "Sign Up" : "Sign In"}
        </Card.Title>
        {inputError && (
          <Alert className="d-flex justify-content-center p-1" variant="danger">
            {inputError}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          {isSignup && (
            <React.Fragment>
              <Form.Row>
                <Form.Group as={Col} controlId="formFirstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    required
                    ref={firstNameRef}
                  />
                </Form.Group>
                <Form.Group as={Col} controlId="formLastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    required
                    ref={lastNameRef}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Choose a username"
                  required
                  ref={usernameRef}
                />
              </Form.Group>
            </React.Fragment>
          )}
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email address"
              required
              ref={emailRef}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Choose a password"
              required
              ref={passwordRef}
            />
          </Form.Group>
          {isSignup && (
            <Form.Group controlId="formVerifyPassword">
              <Form.Label>Verify Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-enter password"
                required
                ref={verifyPasswordRef}
              />
            </Form.Group>
          )}
          <Button block variant="primary" type="submit">
            Submit
          </Button>
          <Button
            block
            variant="primary"
            type="button"
            onClick={populateFields}
          >
            Populate Fields
          </Button>
          <Button
            block
            variant="link"
            type="button"
            onClick={() => setIsSignup((prevState) => !prevState)}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default UnauthenticatedApp;
