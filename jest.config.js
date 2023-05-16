module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "testMatch": [
    "**/tests/**/*test.+(ts|tsx|js)"

  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "@swc/jest"
  },
}