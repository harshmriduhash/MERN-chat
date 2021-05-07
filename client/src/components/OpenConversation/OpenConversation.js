import React, { useState, useCallback, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { useAuth } from "../../contexts/AuthProvider";
import { useUser } from "../../contexts/UserProvider";
import { useSocket } from "../../contexts/SocketProvider";

const OpenConversation = ({ conversationId }) => {
  const user = useUser();
  const socket = useSocket();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [text, setText] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [isApiError, setIsApiError] = useState(false);

  const { getConversation, saveMessage } = useAuth();

  useEffect(() => {
    const fetchConversation = async () => {
      setApiMessage("");
      setIsApiError(false);

      const result = await getConversation(conversationId);

      if (result.message) {
        setIsApiError(true);
        setApiMessage(`Error: ${result.message}`);
      } else {
        setSelectedConversation(result.conversation);
      }
    };

    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId, getConversation]);

  const setRef = useCallback((node) => {
    if (node) node.scrollIntoView({ smooth: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = {
      sender: user.email,
      text,
    };

    // Save message to messages array in conversation
    const result = await saveMessage(
      selectedConversation._id,
      selectedConversation.recipients,
      message
    );

    if (result.message) {
      setIsApiError(true);
      setApiMessage(`Error: ${result.message}`);
      return;
    }

    // Means successfully saved message to db
    // setSelectedConversation(result.conversation);

    // Send message to everyone so they can pull new messages
    socket.emit("send-message", {
      id: selectedConversation._id,
      recipients: selectedConversation.recipients,
    });

    setText("");
  };

  useEffect(() => {
    if (!socket) {
      return;
    }

    const fetchConversation = async (convoId) => {
      setApiMessage("");
      setIsApiError(false);

      const result = await getConversation(convoId);

      if (result.message) {
        setIsApiError(true);
        setApiMessage(`Error: ${result.message}`);
      } else {
        setSelectedConversation(result.conversation);
      }
    };

    socket.on("receive-message", (id) => {
      if (id === conversationId) {
        fetchConversation(id);
      }
    });

    return () => socket.off("receive-message");
  }, [socket, conversationId, getConversation]);

  return selectedConversation ? (
    <div className="d-flex flex-column flex-grow-1">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
          {selectedConversation.messages.map((message, index) => {
            const lastMessage =
              selectedConversation.messages.length - 1 === index;
            return (
              <div
                ref={lastMessage ? setRef : null}
                key={index}
                className={`my-1 d-flex flex-column ${
                  message.sender === user.email
                    ? "align-self-end align-items-end"
                    : "align-items-start"
                }`}
              >
                <div
                  className={`rounded px-2 py-1 ${
                    message.sender === user.email
                      ? "bg-primary text-white"
                      : "border"
                  }`}
                >
                  {message.text}
                </div>
                <div
                  className={`text-muted small ${
                    message.sender === user.email ? "text-right" : ""
                  }`}
                >
                  {message.sender === user.email ? "You" : message.sender}
                </div>
              </div>
            );
          })}
          {apiMessage && (
            <Alert
              className="d-flex justify-content-center p-1"
              variant={isApiError ? "danger" : "success"}
            >
              {apiMessage}
            </Alert>
          )}
        </div>
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "75px", resize: "none" }}
            />
            <InputGroup.Append>
              <Button type="submit">Send</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  ) : (
    "Loading..."
  );
};

export default OpenConversation;
