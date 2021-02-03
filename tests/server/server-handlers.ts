import {rest} from 'msw'

import {
  buildAuthenticatedGitHubUser,
  buildContributorStats,
  buildGitHubRepo,
  buildUserProfile,
} from '@tests/generate'
import {constants} from '@web/lib/common'

const {api} = constants
const githubURL = 'https://api.github.com'

const frontEndHandlers = [
  rest.get(`${api.url}/me`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildUserProfile()))
  }),
]

const backEndHandlers = [
  rest.get(`${githubURL}/user`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildAuthenticatedGitHubUser()))
  }),
  rest.get(`${githubURL}/user/repos`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(new Array(100).fill(buildGitHubRepo())),
    )
  }),
  rest.get(
    `${githubURL}/repos/:owner/:repo/stats/contributors`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(new Array(100).fill(buildContributorStats())),
      )
    },
  ),
]

const handlers = [...frontEndHandlers, ...backEndHandlers]

export {handlers}
