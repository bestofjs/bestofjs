import { render } from "@testing-library/react";
import { Root } from "../root";
import { initializeColorMode } from "components/core/color-mode";

import { debug } from "jest-preview";

// Used to render a component not coupled with others (isolated)
// The goal is to render faster than `renderApp`
const customRender = (ui: any, options: any = {}) => {
  initializeColorMode("system");
  return render(ui, { ...options });
};

// Render the whole app
const renderApp = async () => {
  initializeColorMode("system");
  return render(<Root />);
};

export * from "@testing-library/react";
export { customRender as render, renderApp, debug };
