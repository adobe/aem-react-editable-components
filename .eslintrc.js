/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const OFF = 0;
const WARN = 1;
const ERROR = 2;

module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2020,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: false,
  },
  globals: {},
  ignorePatterns: ['typesoutput/'],
  extends: [
    '@adobe/eslint-config-editorxp',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['prettier', 'react', 'react-hooks', 'jest'],
  rules: {
    'max-lines-per-function': [
      WARN,
      {
        max: 75,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-params': [
      WARN,
      {
        max: 6,
      },
    ],
    'max-statements': [
      WARN,
      {
        max: 15,
      },
    ],
    'no-unused-vars': [
      WARN,
      {
        argsIgnorePattern: '^_',
      },
    ],
    'padding-line-between-statements': [OFF],
    'react-hooks/exhaustive-deps': ERROR,
    'react-hooks/rules-of-hooks': ERROR,
    'react/jsx-curly-brace-presence': [WARN, 'never'],
    'react/prop-types': OFF,
    complexity: [
      WARN,
      {
        max: 15,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.test.js', '*.test.ts', '*.test.tsx'],
      rules: {
        'max-lines-per-function': [OFF],
        'no-irregular-whitespace': [OFF],
        'max-statements': [OFF],
      },
    },
  ],
};
