// import { RequestHandler } from "msw";

import { resources } from "../resources";
import { handleResource } from "./handler";

export const handlers = ([] as any[]).concat(
  ...Object.entries(resources).map(([endpoint, resource]) =>
    handleResource(resource, endpoint)
  )
);
