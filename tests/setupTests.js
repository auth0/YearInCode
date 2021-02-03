import '@testing-library/jest-dom/extend-expect'

import {server} from './server'

// enable API mocking in test runs using the same request handlers
beforeAll(() => {
  server.listen()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})

afterAll(() => {
  server.close()
  console.error.mockRestore()
  console.warn.mockRestore()
})
