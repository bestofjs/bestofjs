import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/dom";
import "whatwg-fetch";
import { server } from "mocks/server";
import { jestPreviewConfigure } from "jest-preview";

// Set default timeout for waitFor, findBy... 2500ms
configure({
  asyncUtilTimeout: 2500,
});

jestPreviewConfigure({
  externalCss: ["src/stylesheets/base.css"],
  autoPreview: true,
});

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  // Reset pathname to `/` after each test.
  window.history.pushState({}, "", "/");

  // Reset all mock after each test
  jest.clearAllMocks();

  // Reset any request handlers that we may add during the tests,
  // so they don't affect other tests.
  server.resetHandlers();
});

// Clean up after the tests are finished.
afterAll(() => {
  server.close();
});

let matches = true;

// Set true if you want `useMedia` return false. Default: true
export function setMatchesMedia(boolean: boolean) {
  matches = boolean;
}

function getMatchesMedia() {
  return matches;
}

window.matchMedia = (query) => {
  return {
    matches: getMatchesMedia(),
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};
window.open = jest.fn();
window.scrollTo = jest.fn();

// @ts-expect-error JSDOM does not support IntersectionObserver
window.IntersectionObserver = function () {
  return {
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
    takeRecords: jest.fn(),
  };
};
