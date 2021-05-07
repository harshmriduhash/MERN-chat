import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";

import { useAuth } from "../../contexts/AuthProvider";

const ManageConversationModal = ({ conversationId }) => {
  const [apiMessage, setApiMessage] = useState("");
  const [isApiError, setIsApiError] = useState(false);

  const [conversationInfo, setConversationInfo] = useState(null);

  const { removeConversation, getConversation } = useAuth();

  useEffect(() => {
    const fetchConversation = async () => {
      setApiMessage("");
      setIsApiError(false);

      const result = await getConversation(conversationId);

      if (result.message) {
        setApiMessage(`Error: ${result.message}`);
        setIsApiError(true);
      } else {
        setConversationInfo(result.conversation);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, []);

  const handleRemoveConversation = async () => {
    if (conversationInfo) {
      setApiMessage("");
      setIsApiError(false);
      const result = await removeConversation(conversationId);
      if (result.message) {
        setApiMessage(`Error: ${result.message}`);
        setIsApiError(true);
      } else {
        setApiMessage(
          `Success: '${conversationInfo.name}' has been removed from conversations`
        );
      }
    }
  };

  return (
    <React.Fragment>
      <Modal.Header closeButton>
        <Modal.Title>Manage Conversation</Modal.Title>
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
        {conversationInfo && (
          <React.Fragment>
            <p>
              <strong>Name:</strong>{" "}
              {conversationInfo ? conversationInfo.name : ""}
            </p>
            <strong>Participants:</strong>
            {conversationInfo ? (
              <ListGroup className="mb-3">
                {conversationInfo.recipients.map((recipient) => (
                  <ListGroup.Item key={recipient}>{recipient}</ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              ""
            )}

            <p>
              <strong>Date Created:</strong>{" "}
              {conversationInfo ? conversationInfo.createdAt : ""}
            </p>
          </React.Fragment>
        )}
      </Modal.Body>
      {conversationInfo && (
        <Modal.Footer>
          <Button
            variant="danger"
            type="button"
            className="d-flex align-items-center"
            onClick={handleRemoveConversation}
            disabled={!isApiError && apiMessage}
          >
            Remove Conversation
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

export default ManageConversationModal;
