import {rest, server, githubURLs} from '@api/tests/mock-server'
import {
  buildAuthenticatedGitHubUser,
  buildContributorStats,
  buildGitHubRepo,
} from '@api/tests/generate'
import {PosterImageSizes, PosterSteps} from '@nebula/types/poster'

import PosterModel from '../poster.model'

import * as start from './start'
import * as startUtils from './start.utils'

const mockedGenerateImagesAndUploadToS3 = jest.spyOn(
  startUtils,
  'generateImagesAndUploadToS3',
)
const mockedSendPosterMail = jest.spyOn(startUtils, 'sendPosterMail')
const mockedGetGitHubToken = jest.spyOn(startUtils, 'getGitHubToken')

const userId = 'MOCK_USER_ID'
const username = 'MOCK_USER_NAME'
const posterSlug = 'MOCK_POSTER_SLUG'
const mockedPosterImages: PosterImageSizes = {
  twitter: 'twitter.png',
  highQualityPoster: 'high-quality.png',
  instagram: 'instagram.png',
  openGraph: 'openGraph.png',
}

beforeEach(async () => {
  await PosterModel.delete({posterSlug, userId})
})

afterEach(async () => {
  await PosterModel.delete({posterSlug, userId})
})

test('should generate user activity', async () => {
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

  const event: any = {
    Records: [
      {
        body: {
          userId,
          username,
          posterSlug,
          year: 2020,
        },
      },
    ],
  }

  mockedGetGitHubToken.mockResolvedValueOnce('')
  mockedGenerateImagesAndUploadToS3.mockResolvedValueOnce(mockedPosterImages)
  mockedSendPosterMail.mockResolvedValueOnce()

  const results = await start.startImplementation(event)
  const result = getFirstResult(results)
  const databaseResult = await PosterModel.get({posterSlug, userId})

  expect(databaseResult).toMatchObject({
    posterSlug: result.posterSlug,
    posterData: JSON.stringify(result.posterData),
    userId,
    updatedAt: expect.any(Date),
    step: PosterSteps.READY,
    posterImages: mockedPosterImages,
  })

  expect(mockedGenerateImagesAndUploadToS3).toHaveBeenCalledTimes(1)
  expect(mockedSendPosterMail).toHaveBeenCalledTimes(1)

  expect(mockedGenerateImagesAndUploadToS3).toHaveBeenCalledWith(
    result.posterData,
    result.posterSlug,
  )
  expect(mockedSendPosterMail).toHaveBeenCalledWith({
    name: result.posterData.name,
    posterSlug: result.posterSlug,
    sendTo: user.email,
  })

  expect(result.posterSlug).toContain(posterSlug)
  expect(result.posterData).toEqual({
    name: user.name,
    followers: user.followers,
    year: 2020,
    dominantLanguage: repos[0].language,
    dominantRepository: repos[0].name,
    totalLinesOfCode: 4965,
    totalRepositories: 5,
    weeks: [
      {
        week: 14,
        lines: 445,
        commits: 10,
        total: 455,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
      {
        week: 28,
        lines: 635,
        commits: 30,
        total: 665,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
      {
        week: 34,
        lines: 3885,
        commits: 20,
        total: 3905,
        dominantLanguage: repos[0].language,
        dominantRepository: repos[0].name,
      },
    ],
  })
})

test('should be able to generate based on selected year', async () => {
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

  const event: any = {
    Records: [
      {
        body: {
          userId,
          username,
          posterSlug,
          year: 2018,
        },
      },
    ],
  }

  mockedGetGitHubToken.mockResolvedValueOnce('')
  mockedGenerateImagesAndUploadToS3.mockResolvedValueOnce(mockedPosterImages)
  mockedSendPosterMail.mockResolvedValueOnce()

  const results = await start.startImplementation(event)
  const result = getFirstResult(results)

  expect(result.posterSlug).toContain(posterSlug)
  expect(result.posterData).toEqual({
    name: user.name,
    followers: user.followers,
    year: 2018,
    dominantLanguage: undefined,
    dominantRepository: undefined,
    totalLinesOfCode: 0,
    totalRepositories: 5,
    weeks: [],
  })
})

const getFirstResult = <T>(results: PromiseSettledResult<T>[]) => {
  if (results[0].status !== 'fulfilled') {
    throw new Error('First result should be succesfull')
  }
  return results[0].value
}
