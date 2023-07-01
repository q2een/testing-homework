module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  'moduleNameMapper': {
    '@client/(.*)': '<rootDir>/src/client/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  testMatch: [ "**/?(*.)+(test).[jt]s?(x)" ]
};
