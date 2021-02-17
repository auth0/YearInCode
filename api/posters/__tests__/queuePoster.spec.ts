import createHttpError from 'http-errors'

import * as randomUtils from '@api/lib/random'
import * as tokenUtils from '@api/lib/token'

import PosterModel from '../poster.model'
import {queuePosterImplementation} from '../queuePoster'

const mockedGeneratePosterSlug = jest.spyOn(randomUtils, 'generatePosterSlug')
const mockedDecodeToken = jest.spyOn(tokenUtils, 'decodeToken')
const mockedGetTokenFromString = jest.spyOn(tokenUtils, 'getTokenFromString')

const userId = 'MOCK_USER_ID'
const username = 'MOCK_USER_NAME'
const posterSlug = 'MOCK_POSTER_SLUG'
const authorization = 'MOCK_AUTHORIZATION'
const token = 'MOCK_TOKEN'

test('should return 401 error if userId does not match token', async () => {
  mockedGeneratePosterSlug.mockReturnValueOnce(posterSlug)
  mockedGetTokenFromString.mockReturnValueOnce(token)
  mockedDecodeToken.mockReturnValueOnce({payload: {sub: 'ANY_ID'}})

  const event: any = {
    pathParameters: {
      userId,
    },
    body: {
      year: 2020,
      username,
    },
    headers: {
      Authorization: authorization,
    },
  }

  expect(await queuePosterImplementation(event)).toEqual(
    createHttpError(401, 'Unauthorized'),
  )
})

test('should return 500 error if there is an error in database', async () => {
  mockedGeneratePosterSlug.mockReturnValueOnce(posterSlug)
  mockedGetTokenFromString.mockReturnValueOnce(token)
  mockedDecodeToken.mockReturnValueOnce({payload: {sub: userId}})

  const event: any = {
    pathParameters: {
      userId,
    },
    body: {
      year: 2020,
      username,
    },
    headers: {
      Authorization: authorization,
    },
  }

  expect(await queuePosterImplementation(event)).toEqual(
    createHttpError(500, 'ERROR adding to queue'),
  )
})
