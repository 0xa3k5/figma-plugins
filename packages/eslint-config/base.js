const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

module.exports = {
  extends: [
    'prettier',
    'plugin:prettier/recommended',
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    'eslint-config-turbo',
    'plugin:@figma/figma-plugins/recommended',
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
    'tailwindcss/config': require.resolve(
      '../tailwind-config/tailwind.config.ts'
    ),
    'tailwindcss/no-custom-classname': false,
    'import/resolver': {
      typescript: {
        project,
      },
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.d.t.s',
    '**/tailwind.config.ts',
  ],
  rules: {
    // 'object-curly-spacing': ['warn', 'always'],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'prettier/prettier': ['error'],
    'prefer-const': 'error',
    'no-irregular-whitespace': 'error',
    'no-trailing-spaces': 'error',
    semi: 'error',
    'no-empty-function': 'error',
    'no-duplicate-imports': 'error',
    'newline-after-var': 'error',
    'no-redeclare': 'off',
    'no-undef': 'off',
    'no-unused-vars': [
      'warn',
      { vars: 'all', args: 'after-used', ignoreRestSiblings: false },
    ],
    'tailwindcss/migration-from-tailwind-2': 'off',
  },
};
