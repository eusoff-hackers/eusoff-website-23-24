module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'import/no-dynamic-require': 0,
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    '@typescript-eslint/no-var-requires': 0,
  },
  root: true,
  ignorePatterns: [`scripts/*`, `environment.d.ts`],
};
