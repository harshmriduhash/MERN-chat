import React, { useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthProvider";

const NewContactModal = () => {
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitError, setIsSubmitError] = useState(false);

  const emailRef = useRef();

  const { createContact } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitMessage("");
    setIsSubmitError(false);

    const result = await createContact({ email: emailRef.current.value });

    if (result.message) {
      // Will want to display this message to user
      setSubmitMessage(`Error: ${result.message}`);
      setIsSubmitError(true);
    } else {
      setSubmitMessage(
        `Success: new contact '${emailRef.current.value}' has been added`
      );
      emailRef.current.value = "";
    }
  };

  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>New Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {submitMessage && (
          <Alert
            className="d-flex justify-content-center p-1"
            variant={isSubmitError ? "danger" : "success"}
          >
            {submitMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>
              <strong>Email</strong>
            </Form.Label>
            <Form.Control type="email" ref={emailRef} required></Form.Control>
          </Form.Group>
          <Button type="submit">Add Contact</Button>
        </Form>
      </Modal.Body>
    </React.Fragment>
  );
};

export default NewContactModal;
