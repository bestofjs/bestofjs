import { render } from "react-dom";

import { unregister } from "./registerServiceWorker";
import { Root } from "./root";
import { initializeColorMode } from "components/core/color-mode";

// Old-fashioned stylesheets
import "./stylesheets/base.css";

function start() {
  initializeColorMode("system"); // required to read user's preference
  render(<Root />, document.getElementById("root"));
}

start();
unregister();
