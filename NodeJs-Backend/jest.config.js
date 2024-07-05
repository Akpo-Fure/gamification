module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  //   collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  //   coverageDirectory: "coverage",
  //   coverageReporters: ["text", "html"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  testPathIgnorePatterns: ["/node_modules/"],
  transformIgnorePatterns: ["/node_modules/"],
};
