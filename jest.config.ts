module.exports = {
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
      '**/*.{js,ts}',
      '!**/*.dto.ts',
      '!**/*.exception.ts',
      '!**/route.ts',
      '!**/*.enum.ts',
      '!**/*.schema.ts',
      '!**/*.util.ts',
      '!**/*.config.ts',
      '!**/index.ts',
      '!**/main.ts',
  ],
  coverageReporters: ['text'], 
  rootDir: './src/',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};