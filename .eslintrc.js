module.exports = {
  root: true,
  ignorePatterns: [
    ".eslintrc.js",
    "jest.config.js",
    "vite.config.ts",
    "/scripts",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "testing-library"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:testing-library/react",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: "./tsconfig.json",
  },
  settings: {
    react: {
      pragma: "React",
      version: "16.3",
    },
  },
  overrides: [
    // Only uses Testing Library lint rules in test files
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
  rules: {
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,

    // eslint-plugin-testing-library
    "testing-library/no-wait-for-multiple-assertions": 0,
  },
};
