import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { App } from "./app";

import "./styles.scss";

if (process.env.NODE_ENV === "development") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { worker } = require("mocks/msw/worker");
  worker.start();
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PATH_PREFIX}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
