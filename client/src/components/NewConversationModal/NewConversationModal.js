import React, { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useUser } from "../../contexts/UserProvider";
import { useAuth } from "../../contexts/AuthProvider";

const NewConversationModal = () => {
  const conversationNameRef = useRef();

  const user = useUser();
  const { createConversation, getUser } = useAuth();

  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitMessage("");
    setIsSubmitError(false);

    let result = await createConversation(conversationNameRef.current.value, [
      ...selectedContacts,
      user.email,
    ]);

    if (result.message) {
      setIsSubmitError(true);
      setSubmitMessage(`Error: ${result.message}`);
    } else {
      // Reset modal for user to use again
      setSelectedContacts([]);
      setSubmitMessage(
        `Success: new conversation '${result.conversation.name}' has been created`
      );
      conversationNameRef.current.value = "";

      // Update user conversations
      result = await getUser();

      if (result.message) {
        setIsSubmitError(true);
        setSubmitMessage(`Error: ${result.message}`);
      }
    }
  };

  const handleCheckboxChange = (contact) => {
    setSelectedContacts((prevSelectedContacts) => {
      if (prevSelectedContacts.includes(contact)) {
        return prevSelectedContacts.filter((prevContact) => {
          return contact !== prevContact;
        });
      } else {
        return [...prevSelectedContacts, contact];
      }
    });
  };

  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>New Conversation</Modal.Title>
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
          <Form.Group controlId="conversationName">
            <Form.Label>Conversation Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter a name for this conversation"
              required
              ref={conversationNameRef}
            />
          </Form.Group>
          <Form.Group controlId="chooseRecipients">
            <Form.Label>Choose Recipients</Form.Label>
            {user.contacts.map((contact) => (
              <Form.Check
                type="checkbox"
                checked={selectedContacts.includes(contact)}
                label={contact}
                onChange={() => handleCheckboxChange(contact)}
                key={contact}
              />
            ))}
          </Form.Group>
          <Button type="submit" disabled={!selectedContacts.length}>
            Create
          </Button>
        </Form>
      </Modal.Body>
    </React.Fragment>
  );
};

export default NewConversationModal;
