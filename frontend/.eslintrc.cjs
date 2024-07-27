module.exports = {
  extends: "../../.eslintrc.json",
  parserOptions: {
    project: "apps/frontend/tsconfig.json",
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.cjs", "*.config.js", "*.config.ts"],
};
