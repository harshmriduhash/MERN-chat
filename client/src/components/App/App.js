import React from "react";

import { useUser } from "../../contexts/UserProvider";

import AuthenticatedApp from "../AuthenticatedApp/AuthenticatedApp";
import UnauthenticatedApp from "../UnauthenticatedApp/UnauthenticatedApp";

const App = () => {
  const user = useUser();
  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
};

export default App;
