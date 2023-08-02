import { render } from "react-dom";

import { Root } from "./root";
import { initializeColorMode } from "components/core/color-mode";

// Old-fashioned stylesheets
import "./stylesheets/css-reset.css";
import "./stylesheets/base.css";

function start() {
  initializeColorMode("system"); // required to read user's preference
  render(<Root />, document.getElementById("root"));
}

const prepare = async (): Promise<void> => {
  if (process.env.VITE_APP_MOCK === "1") {
    const { worker } = await import("./mocks/browser");
    worker.start({
      onUnhandledRequest: "bypass",
    });
  }
};

prepare().then(() => {
  start();
});
