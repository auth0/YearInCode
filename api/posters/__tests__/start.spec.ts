import {ManagementClient} from 'auth0'

import {rest, server, githubURLs} from '@api/tests/mock-server'
import {
  buildAuthenticatedGitHubUser,
  buildContributorStats,
  buildGitHubRepo,
} from '@api/tests/generate'

import {startImplementation as start} from '../start'

jest.mock('auth0')

const mockedManagementClient = ManagementClient as jest.MockedClass<
  typeof ManagementClient
>

it.only('should generate user activity', async () => {
  const user = buildAuthenticatedGitHubUser()
  const repos = Array.from({length: 5}, () => buildGitHubRepo())
  const contributions = new Array(5).fill(buildContributorStats())

  server.use(
    rest.get(githubURLs.user.getAuthenticated, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(user))
    }),
    rest.get(
      githubURLs.repos.listForAuthenticatedUser,
      async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(repos))
      },
    ),
    rest.get(githubURLs.repos.getContributions, async (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(contributions))
    }),
  )

  const userId = 'MOCK_USER_ID'

  const event: any = {
    Records: [
      {
        body: {
          userId,
        },
      },
    ],
  }

  mockedManagementClient.prototype.getUser = jest.fn().mockResolvedValueOnce({
    identities: [{provider: 'github', access_token: undefined}],
  })

  const results = await start(event)
  const result = results[0].status === 'fulfilled' && results[0].value

  expect(result.posterSlug).toContain(`${user.name.toLowerCase()}-poster-2020`)
  expect(result.posterData).toEqual({
    name: user.name,
    followers: user.followers,
    year: 2020,
    dominantLanguage: repos[0].language,
    dominantRepository: repos[0].name,
    weeks: [
      {
        week: 14,
        lines: 89,
        commits: 2,
        total: 91,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
      {
        week: 27,
        lines: 127,
        commits: 6,
        total: 133,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
      {
        week: 32,
        lines: 777,
        commits: 4,
        total: 781,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
    ],
  })
})
