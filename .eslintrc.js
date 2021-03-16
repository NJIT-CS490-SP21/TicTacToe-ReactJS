module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["plugin:react/recommended", "airbnb"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  ignorePatterns: ["setupTests.js", "reportWebVitals.js", "App.test.js"],
  rules: {
    "react/no-array-index-key": 0,
    "react-hooks/exhaustive-deps": 0,
    "react/jsx-filename-extension": 0,
  },
};
