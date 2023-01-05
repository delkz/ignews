module.exports = {
    testIgnorePatterns: ['/node_modules/','/.next/'],
    setupFilesAfterEnv:[
        "<rootDir>/src/tests/setupTests.ts"
    ],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$":"<rootDir>"
    },
    testEnvironment: 'jsdom'
}