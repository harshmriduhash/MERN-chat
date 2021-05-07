import React, { useContext } from "react";

import { useAuth } from "./AuthProvider";

const UserContext = React.createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = (props) => (
  <UserContext.Provider value={useAuth().data.user} {...props} />
);
