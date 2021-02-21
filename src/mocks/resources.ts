import { MemoryController } from "./controllers";

export const resources = {
  "/api/v1/posts": new MemoryController(
    () => import("./data/api/v1/posts.json")
  ),
};
