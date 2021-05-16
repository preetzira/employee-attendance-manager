module.exports = {
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/tests/config/setup.js"],
  verbose: true,
  // globalSetup: "<rootDir>/tests/config/setup.js", doesn't work with mongoose
  // globalTeardown: "<rootDir>/tests/config/teardown.js", doesn't work with mongoose
  testEnvironment: "node",
}
