import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
      <title>JakeBates.com</title>
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
