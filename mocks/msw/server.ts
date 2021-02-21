import { setupServer } from "msw/node";

import { handlers } from "./utils";

export const server = setupServer(...handlers);
