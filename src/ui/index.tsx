import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";

import "./index.scss";

const PATH_PREFIX = process.env.PATH_PREFIX;

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require("mocks/msw/worker");
  worker.start();
}

// if sent here from the 404 page, update the history URI
const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");
if (redirect) {
  history.replaceState(null, "", redirect);
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={PATH_PREFIX}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
