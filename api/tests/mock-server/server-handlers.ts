import {rest} from 'msw'

import {
  buildAuthenticatedGitHubUser,
  buildContributorStats,
  buildGitHubRepo,
} from '../generate'

const githubURL = 'https://api.github.com'

const handlers = [
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

export {handlers}
