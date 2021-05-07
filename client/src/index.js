import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App/App";
import "bootstrap/dist/css/bootstrap.min.css";

import AppProviders from "./contexts/AppProviders";

ReactDOM.render(
  <AppProviders>
    <App />
  </AppProviders>,
  document.getElementById("root")
);
