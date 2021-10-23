import React from "react";
import { Router } from "react-router-dom";
import ReactDOM from "react-dom";
import { createMemoryHistory } from "history";

import { AuthProvider } from "containers/auth-container";
import { ProjectDataProvider } from "containers/project-data-container";
import { App } from "./app";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const history = createMemoryHistory();

  ReactDOM.render(
    <Router history={history}>
      <AuthProvider>
        <ProjectDataProvider>
          <App />
        </ProjectDataProvider>
      </AuthProvider>
    </Router>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
