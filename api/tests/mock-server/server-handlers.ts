import {rest} from 'msw'

import {
  buildAuthenticatedGitHubUser,
  buildContributorStats,
  buildGitHubRepo,
} from '../generate'

const githubBaseURL = 'https://api.github.com'
const githubURLs = {
  user: {
    getAuthenticated: `${githubBaseURL}/user`,
  },
  repos: {
    listForAuthenticatedUser: `${githubBaseURL}/user/repos`,
    getContributions: `${githubBaseURL}/repos/:owner/:repo/stats/contributors`,
  },
}

const handlers = [
  rest.get(githubURLs.user.getAuthenticated, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(buildAuthenticatedGitHubUser()))
  }),
  rest.get(githubURLs.repos.listForAuthenticatedUser, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(Array.from({length: 5}, () => buildGitHubRepo())),
    )
  }),
  rest.get(githubURLs.repos.getContributions, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json(new Array(5).fill(buildContributorStats())),
    )
  }),
]

export {handlers, githubURLs}
