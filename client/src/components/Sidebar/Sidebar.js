import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Conversations from "../Conversations/Conversations";
import Contacts from "../Contacts/Contacts";
import NewConversationModal from "../NewConversationModal/NewConversationModal";
import NewContactModal from "../NewContactModal/NewContactModal";

import { useUser } from "../../contexts/UserProvider";

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

const Sidebar = ({
  selectedConversationIndex,
  setSelectedConversationIndex,
}) => {
  const user = useUser();
  const id = user._id;
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isConversationsOpen = activeKey === CONVERSATIONS_KEY;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ width: "250px" }} className="d-flex flex-column">
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="border-right overflow-auto flex-grow-1">
          <Tab.Pane eventKey={CONVERSATIONS_KEY}>
            <Conversations
              selectedConversationIndex={selectedConversationIndex}
              setSelectedConversationIndex={setSelectedConversationIndex}
            />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACTS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div className="p-2 border-top border-right small">
          Your ID: <span className="text-muted">{id}</span>
        </div>
        <Button className="rounded-0" onClick={() => setIsModalOpen(true)}>
          New {isConversationsOpen ? "Conversation" : "Contact"}
        </Button>
      </Tab.Container>
      <Modal show={isModalOpen} onHide={closeModal}>
        {isConversationsOpen ? <NewConversationModal /> : <NewContactModal />}
      </Modal>
    </div>
  );
};

export default Sidebar;
