import express from "express";

import { Controller } from "../controllers";

export function handleResource<Model>(controller: Controller<Model>) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    if (controller.list) {
      try {
        res.send(await controller.list(req.query));
      } catch (err) {
        next(err);
      }
    } else {
      res.sendStatus(405);
    }
  });

  router.post("/", async (req, res, next) => {
    if (controller.create) {
      try {
        res.send(await controller.create(req.body));
      } catch (err) {
        next(err);
      }
    } else {
      res.sendStatus(405);
    }
  });

  router.get("/:id", async (req, res, next) => {
    if (controller.get) {
      try {
        res.send(await controller.get(req.params.id));
      } catch (err) {
        next(err);
      }
    } else {
      res.sendStatus(405);
    }
  });

  return router;
}
