'use strict';

module.exports = {
    preset: 'ts-jest',
    setupFilesAfterEnv: [ '<rootDir>/test/setupTests.ts' ],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: [ '<rootDir>/**/*.test.ts', '<rootDir>/**/*.test.tsx' ],
    testPathIgnorePatterns: [ 'node_modules', 'lib', 'dist', 'node' ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}'
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/lib/',
        '/dist/',
        '/node/',
        'src/types.ts',
        'src/types.d.ts',
        'src/aem-react-editable-components.ts'
    ],
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node'
    ]
};
