import React from "react";
import { AuthProvider } from "./AuthProvider";
import { UserProvider } from "./UserProvider";

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
};

export default AppProviders;
