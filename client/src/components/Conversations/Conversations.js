import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

import ManageConversationModal from "../ManageConversationModal/ManageConversationModal";

import { useAuth } from "../../contexts/AuthProvider";
import { useUser } from "../../contexts/UserProvider";

const Conversations = ({
  selectedConversationIndex,
  setSelectedConversationIndex,
}) => {
  const user = useUser();
  const { fetchConversations } = useAuth();

  const [conversations, setConversations] = useState([]);

  const [apiMessage, setApiMessage] = useState("");
  const [isApiError, setIsApiError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getConversations = async () => {
      setApiMessage("");
      setIsApiError(false);

      const result = await fetchConversations();

      if (result.message) {
        setApiMessage(`Error: ${result.message}`);
        setIsApiError(true);
      } else {
        setConversations(result.conversations);
        if (
          result.conversations.length > 0 &&
          selectedConversationIndex === -1
        ) {
          setSelectedConversationIndex(0);
        }
      }
    };

    getConversations();
  }, [
    user,
    fetchConversations,
    setSelectedConversationIndex,
    selectedConversationIndex,
  ]);

  return (
    <React.Fragment>
      <ListGroup variant="flush">
        {apiMessage && (
          <Alert
            className="d-flex justify-content-center p-1"
            variant={isApiError ? "danger" : "success"}
          >
            {apiMessage}
          </Alert>
        )}
        {conversations.map((conversation, index) => (
          <ListGroup.Item
            key={index}
            action
            active={index === selectedConversationIndex}
            onClick={() => setSelectedConversationIndex(index)}
          >
            <div className="d-flex align-items-center">
              {conversation.name}
              {index === selectedConversationIndex && (
                <div
                  id={conversation.id}
                  tabIndex={index}
                  role="button"
                  aria-pressed="false"
                  className="ml-auto p-0 pl-1 pr-1 border-0 btn btn-primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-three-dots"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                </div>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Modal show={isModalOpen} onHide={closeModal}>
        <ManageConversationModal
          conversationId={
            conversations.length > 0 && selectedConversationIndex > -1
              ? conversations[selectedConversationIndex].id
              : null
          }
        />
      </Modal>
    </React.Fragment>
  );
};

export default Conversations;
