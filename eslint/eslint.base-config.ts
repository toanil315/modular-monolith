//@ts-ignore
import tsParser from '@typescript-eslint/parser';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { ConfigWithExtends } from '@eslint/config-helpers';

const compat = new FlatCompat({
  baseDirectory: './',
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export const baseConfigs: ConfigWithExtends = {
  languageOptions: {
    parser: tsParser,
    sourceType: 'module',

    parserOptions: {
      project: '../tsconfig.json',
      tsconfigRootDir: __dirname,
    },

    globals: {
      ...globals.node,
      ...globals.jest,
    },
  },

  plugins: {
    '@typescript-eslint': typescriptEslintEslintPlugin,
  },

  extends: compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),

  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
