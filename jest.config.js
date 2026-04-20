const { clear } = require("console");
const nextJest = require("next/jest");

const createJestConfig = nextJest({
    dir: "./",
});

const customJestConfig = {
    coverageProvider: "v8",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    collectCoverage: true,
    collectCoverageFrom: [
        "src/**/*.{js,jsx,ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/index.{js,ts,tsx}",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["json", "text", "lcov"],
    clearMocks: true,
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    testMatch: [
        "**/__tests__/**/*.test.ts",
        "**/__tests__/**/*.spec.ts",
        "**/__tests__/**/*.test.tsx",
    ],
};

module.exports = createJestConfig(customJestConfig);