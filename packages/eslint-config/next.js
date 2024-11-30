import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginTailwind from "eslint-plugin-tailwindcss";
import globals from "globals";
import tsEsLint from "typescript-eslint";

import { config as baseConfig } from "./base.js";

// console.log(pluginTailwind.configs["flat/recommended"][0].plugins);

// console.log(pluginTailwind.rules);

const twRules = pluginTailwind.configs["flat/recommended"].find((config) =>
  Boolean(config.rules)
).rules;

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = [
  ...baseConfig,
  js.configs.recommended,
  eslintConfigPrettier,
  ...tsEsLint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  {
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TODO understand why it's needed to avoid: `'className' is missing in props validation` errors, in UI components
    },
  },
  {
    plugins: {
      tailwindcss: pluginTailwind,
    },
    rules: {
      ...twRules,
      "tailwindcss/no-custom-classname": "off",
    },
    settings: {
      tailwindcss: {
        callees: ["cn", "cva", "klass"],
      },
    },
  },
];
