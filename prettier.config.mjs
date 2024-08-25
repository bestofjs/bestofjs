/** @type {import('prettier').Config} */
const config = {
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@repo/(.*)$", // monorepo dependencies
    "^@/(.*)$",
    "^[./]",
  ],
  importOrderTypeScriptVersion: "5.5.4",
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};

export default config;
