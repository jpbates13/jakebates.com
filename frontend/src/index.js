import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { store } from "./app/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Helmet>
        <title>JakeBates.com</title>
      </Helmet>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
