export default {
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }]
  },
  moduleFileExtensions: ["ts", "tsx", "js"],
  testMatch: ["**/?(*.)+(spec|test|unit|integration|acceptance).[jt]s?(x)"],
  testPathIgnorePatterns: ["node_modules", "dist"],
  testEnvironment: "node",
  coverageReporters: ["html", "text", "text-summary", "cobertura"]
};
