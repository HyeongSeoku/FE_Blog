module.exports = {
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    "*.config.js",
    "*.config.ts",
    "tsconfig.json",
    "next.config.mjs",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  rules: {
    "comma-dangle": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-expressions": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "prettier/prettier": "error",
  },
};
