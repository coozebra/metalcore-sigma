/* eslint-disable import/no-anonymous-default-export */
export default {
  clearMocks: true,
  moduleDirectories: ['node_modules', 'src'],
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['./rtl.setup.ts', '@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
}
