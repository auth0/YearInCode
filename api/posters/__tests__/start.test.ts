import {ManagementClient} from 'auth0'
import AWS from 'aws-sdk'
import AWSMock from 'aws-sdk-mock'

import dynamoose from '@api/lib/db'

import PosterModel from '../poster.model'
import ConnectionModel from '../connection.model'
import {start} from '../start'

jest.mock('auth0')
jest.mock('../connection.model')
jest.mock('../poster.model')

const mockedPosterModel = PosterModel as jest.Mocked<typeof PosterModel>
const mockedConnectionModel = ConnectionModel as jest.Mocked<
  typeof ConnectionModel
>

beforeAll(() => {
  const ddb = new AWS.DynamoDB()
  dynamoose.aws.ddb.set(ddb)
})

afterAll(() => {
  dynamoose.aws.ddb.revert()
})

it.only('should generate user activity', () => {
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

  start(event, null, null)
})
