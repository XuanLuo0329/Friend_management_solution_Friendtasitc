export default {
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.js",
    "!**/node_modules/**"
  ],
  coverageReporters: ["text"],
  setupFiles: ["<rootDir>/jest.setup.js"]
};
