const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  extends: [
    'preact',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    'eslint-config-turbo',
    'airbnb-typescript',
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  plugins: ['simple-import-sort', 'prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/'],
    },
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['node_modules/', 'dist/'],
  rules: {
    'object-curly-spacing': ['warn', 'always'],
    '@next/next/no-html-link-for-pages': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': ['error'],
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    'no-irregular-whitespace': 'error',
    'no-trailing-spaces': 'error',
    semi: 'error',
    'no-empty-function': 'error',
    'no-duplicate-imports': 'error',
    'newline-after-var': 'error',
    camelcase: 'warn',
    'tailwindcss/migration-from-tailwind-2': 'off',
  },
};
