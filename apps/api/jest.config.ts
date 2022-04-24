module.exports = {
  displayName: 'api',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/api',
  collectCoverageFrom: ['src/app/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'html'],
  preset: '../../jest.preset.ts'
};
