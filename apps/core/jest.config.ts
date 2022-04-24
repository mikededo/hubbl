module.exports = {
  displayName: 'core',

  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/core',
  collectCoverageFrom: ['./**/*.ts', './**/*.tsx', '!src/**/index.ts'],
  coverageReporters: ['text', 'html'],
  preset: '../../jest.preset.ts'
};
