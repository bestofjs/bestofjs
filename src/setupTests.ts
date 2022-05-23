import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/dom";

// Set default timeout for waitFor, findBy... 2500ms
configure({
  asyncUtilTimeout: 2500,
});
