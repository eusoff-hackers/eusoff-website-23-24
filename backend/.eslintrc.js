module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'import/no-dynamic-require': 0,
  },
  root: true,
  ignorePatterns: `scripts/*`,
};
