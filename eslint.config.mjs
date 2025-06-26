import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // --- Disables the error for using the 'any' type ---
      "@typescript-eslint/no-explicit-any": "off",

      // --- Disables the error for unused variables (shows a warning instead) ---
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // --- Disables the error for unescaped apostrophes and quotes in JSX ---
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
