export default {
  displayName: 'shared-models-dto',

  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/shared/models/dto',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageReporters: ['text', 'html'],
  preset: '../../../../jest.preset.js'
};
