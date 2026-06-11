export default {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  moduleFileExtensions: ['js', 'json'],
  setupFilesAfterEnv: [],
};

