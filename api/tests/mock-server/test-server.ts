import {setupServer} from 'msw/node'

import {handlers, githubURLs} from './server-handlers'

const server = setupServer(...handlers)

export * from 'msw'
export {server, githubURLs}
