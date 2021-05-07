import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";

import { useUser } from "../../contexts/UserProvider";

import ManageContactModal from "../ManageContactModal/ManageContactModal";

const Contacts = () => {
  const user = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [selectedContactIndex, setSelectedContactIndex] = useState(-1);

  useEffect(() => {
    setSelectedContactIndex(-1);
  }, [user]);

  return (
    <React.Fragment>
      <ListGroup variant="flush">
        {user.contacts.map((contact, index) => (
          <ListGroup.Item
            key={contact}
            action
            active={index === selectedContactIndex}
            onClick={() => setSelectedContactIndex(index)}
          >
            <div className="d-flex align-items-center">
              {contact}
              {index === selectedContactIndex && (
                <div
                  id={contact}
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
        <ManageContactModal contact={user.contacts[selectedContactIndex]} />
      </Modal>
    </React.Fragment>
  );
};

export default Contacts;
