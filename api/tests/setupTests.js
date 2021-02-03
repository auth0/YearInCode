import '@testing-library/jest-dom/extend-expect'
import {startDb, stopDb, createTables, deleteTables} from 'jest-dynalite'

import {server} from './mock-server'

jest.setTimeout(30000)

// enable API mocking in test runs using the same request handlers
beforeAll(() => {
  server.listen()
  jest.spyOn(console, 'error').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  startDb()
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
  deleteTables()
})

afterAll(() => {
  server.close()
  console.error.mockRestore()
  console.warn.mockRestore()
  stopDb()
})
