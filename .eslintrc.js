module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    browser: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'no-console': 'off',
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  }
};