/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: [ '<rootDir>/test/setupTests.ts' ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/test/**/*.test.{ts,tsx}'
  ],
  testPathIgnorePatterns: [
    'node_modules/',
    'dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}'
  ],
  coveragePathIgnorePatterns: [
    'src/types.ts'
  ],
  coverageDirectory: 'dist/coverage',
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ]
};
