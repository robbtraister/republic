import { setupWorker } from "msw";

import { handlers } from "./utils";

export const worker = setupWorker(...handlers);
