/** @type {import('prettier').Config} */
module.exports = {
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/env.mjs",
    "^@/types/(.*)$",
    "^@/config/(.*)$",
    "^@/database/(.*)$",
    "^@/lib/(.*)$",
    "^@/helpers/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/server/(.*)$",
    "^@/styles/(.*)$",
    "^@/app/(.*)$",
    "",
    "^[./]",
  ],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
};
