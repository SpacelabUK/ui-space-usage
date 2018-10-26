module.exports = {
  root: true,
  env: {
    node: true
  },
  parserOptions: {
    sourceType: "module",
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    mocha: true
  },
  extends: ["prettier", "prettier/standard", "plugin:vue/recommended", "plugin:import/errors"],
  plugins: ["vue", "prettier", "mocha"],
  rules: {
    "prettier/prettier": "error"
  },
};
