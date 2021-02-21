import express from "express";
import bodyParser from "body-parser";

import { resources } from "../resources";

import { handleResource } from "./handler";

export function createApp() {
  const app = express.Router();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  Object.entries(resources).map(([endpoint, controller]) => {
    app.use(endpoint, handleResource(controller));
  });

  return app;
}

export default createApp;
