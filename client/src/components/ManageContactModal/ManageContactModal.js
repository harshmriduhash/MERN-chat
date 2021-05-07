import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthProvider";

const ManageContactModal = ({ contact }) => {
  const [apiMessage, setApiMessage] = useState("");
  const [isApiError, setIsApiError] = useState(false);

  const [contactInfo, setContactInfo] = useState(null);

  const { removeContact, getContact } = useAuth();

  useEffect(() => {
    const fetchContact = async () => {
      setApiMessage("");
      setIsApiError(false);

      const result = await getContact(contact);

      if (result.message) {
        setApiMessage(`Error: ${result.message}`);
        setIsApiError(true);
      } else {
        setContactInfo(result.contact);
      }
    };

    if (contact) fetchContact();
  }, []);

  const handleRemoveContact = async () => {
    if (contactInfo) {
      setApiMessage("");
      setIsApiError(false);

      const result = await removeContact(contact);

      if (result.message) {
        setApiMessage(`Error: ${result.message}`);
        setIsApiError(true);
      } else {
        setApiMessage(`Success: '${contact}' has been removed from contacts`);
      }
    }
  };

  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>Manage Contact</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {apiMessage && (
          <Alert
            className="d-flex justify-content-center p-1"
            variant={isApiError ? "danger" : "success"}
          >
            {apiMessage}
          </Alert>
        )}
        {contactInfo && (
          <React.Fragment>
            <p>
              <strong>Name:</strong> {contactInfo ? contactInfo.name : ""}
            </p>
            <p>
              <strong>Username:</strong>{" "}
              {contactInfo ? contactInfo.username : ""}
            </p>
            <p>
              <strong>Email:</strong> {contactInfo ? contactInfo.email : ""}
            </p>
          </React.Fragment>
        )}
      </Modal.Body>
      {contactInfo && (
        <Modal.Footer>
          <Button
            variant="danger"
            type="button"
            className="d-flex align-items-center"
            onClick={handleRemoveContact}
            disabled={!isApiError && apiMessage}
          >
            Remove Contact
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              className="bi bi-person-x-fill ml-2"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </Button>
        </Modal.Footer>
      )}
    </React.Fragment>
  );
};

export default ManageContactModal;
