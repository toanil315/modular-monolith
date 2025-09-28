const { defineConfig } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const typescriptEslintEslintPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const js = require('@eslint/js');
const boundaries = require('eslint-plugin-boundaries');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslintEslintPlugin,
      boundaries,
    },

    extends: compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),

    settings: {
      'boundaries/elements': [
        {
          type: 'common',
          mode: 'full',
          pattern: 'src/modules/common/**',
        },
        {
          type: 'events-public',
          mode: 'full',
          pattern: 'src/modules/events/public/**',
        },
        {
          type: 'events',
          mode: 'full',
          pattern: 'src/modules/events/**',
        },
        {
          type: 'ticketing-public',
          mode: 'full',
          pattern: 'src/modules/ticketing/public/**',
        },
        {
          type: 'ticketing',
          mode: 'full',
          pattern: 'src/modules/ticketing/**',
        },
        {
          type: 'users-public',
          mode: 'full',
          pattern: 'src/modules/users/public/**',
        },
        {
          type: 'users',
          mode: 'full',
          pattern: 'src/modules/users/**',
        },
      ],
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    rules: {
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'boundaries/element-types': [
        'error',
        {
          default: 'allow',
          rules: [
            {
              from: 'ticketing',
              disallow: ['events', 'users'],
              allow: ['events-public', 'users-public'],
              message: 'Ticketing may only import from <module>/public',
            },
            {
              from: 'events',
              disallow: ['ticketing', 'users'],
              allow: ['ticketing-public', 'users-public'],
              message: 'Events may only import from <module>/public',
            },
            {
              from: 'users',
              disallow: ['ticketing', 'events'],
              allow: ['ticketing-public', 'events-public'],
              message: 'Users may only import from <module>/public',
            },
          ],
        },
      ],
    },
  },
]);
