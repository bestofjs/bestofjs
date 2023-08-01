import { setupWorker, rest } from "msw";
import { handlers } from "./handlers";

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(...handlers);

// Make the `worker` and `rest` references available globally,
// so they can be accessed in both runtime and test suites.
// @ts-expect-error Not important to type this since we will use it in runtime
window.msw = {
  worker,
  rest,
};
