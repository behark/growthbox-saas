import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "no-unused-vars": "warn",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
