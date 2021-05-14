module.exports = {
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/tests/config/setup.js"],
  // globalSetup: "<rootDir>/tests/config/setup.js", doesn't work with mongoose
  // globalTeardown: "<rootDir>/tests/config/teardown.js", doesn't work with mongoose
  testEnvironment: "node",
}
