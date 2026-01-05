module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "next/core-web-vitals",
  ],
  rules: {
    "prettier/prettier": ["error"],

    // 🔒 타입 안전성
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-misused-promises": "error",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-argument": "warn",

    // 🧹 불필요한 변수 제거
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],

    // ✅ 기타 스타일 관련
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
  },
  ignorePatterns: [
    ".eslintrc.cjs",
    "next.config.mjs",
    "dist/",
    ".next/",
    "public/theme.js",
    "lighthouserc.cjs",
    "script",
    "postcss.config.mjs",
    "*.config.js",
    "*.config.cjs",
  ],
};
