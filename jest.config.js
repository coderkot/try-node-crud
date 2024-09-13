/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  clearMocks: true,
  coverageProvider: "v8",
  moduleFileExtensions: ["ts", "js", "tsx"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};