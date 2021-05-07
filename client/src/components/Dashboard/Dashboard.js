import React, { useState } from "react";

import Sidebar from "../Sidebar/Sidebar";
import OpenConversation from "../OpenConversation/OpenConversation";
import { useUser } from "../../contexts/UserProvider";
import NavBar from "../NavBar/NavBar";

const Dashboard = () => {
  const [selectedConversationIndex, setSelectedConversationIndex] = useState(
    -1
  );

  const user = useUser();

  return (
    <div className="d-flex flex-column">
      <NavBar />
      <div className="d-flex" style={{ height: "90vh" }}>
        <Sidebar
          selectedConversationIndex={selectedConversationIndex}
          setSelectedConversationIndex={setSelectedConversationIndex}
        />
        {selectedConversationIndex > -1 && (
          <OpenConversation
            conversationId={user.conversations[selectedConversationIndex]}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
