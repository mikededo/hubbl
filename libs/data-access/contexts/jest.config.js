module.exports = {
  displayName: 'data-access-contexts',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }]
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/data-access/contexts',
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.tsx', '!src/**/index.ts'],
  coverageReporters: ['text', 'html']
};
