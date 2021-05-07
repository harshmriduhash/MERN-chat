import React from "react";

import Dashboard from "../Dashboard/Dashboard";

import { SocketProvider } from "../../contexts/SocketProvider";

const AuthenticatedApp = () => {
  return (
    <SocketProvider>
      <Dashboard />
    </SocketProvider>
  );
};

export default AuthenticatedApp;
