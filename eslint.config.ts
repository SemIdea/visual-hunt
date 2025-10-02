import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    extends: ["plugin:@next/next/recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-empty-object-type": "warn",
    },
  },
]);
