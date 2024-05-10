module.exports = {
  extends: "../../.eslintrc.json",
  parserOptions: {
    project: "apps/backend/tsconfig.json",
  },
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js", "jest.config.js", "dist/**"],
};
