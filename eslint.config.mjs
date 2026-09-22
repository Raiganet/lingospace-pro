import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Typographic quotes/apostrophes in Indonesian prose are safe in JSX text.
      // Escaping them across the content pages adds noise without changing output.
      "react/no-unescaped-entities": "off",
      // React 19's opinionated rule flags legitimate one-time mount guards
      // (setMounted(true), hydrating from localStorage). These are intentional.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
