import {ManagementClient} from 'auth0'

import ConnectionModel from '../connection.model'
import {startImplementation as start} from '../start'

jest.mock('auth0')
jest.mock('../poster.model')
jest.mock('../connection.model')

const mockedManagementClient = ManagementClient as jest.MockedClass<
  typeof ManagementClient
>
const mockedConnectionModel = ConnectionModel as jest.Mocked<
  typeof ConnectionModel
>

it.only('should generate user activity', async () => {
  const userId = 'MOCK_USER_ID'
  let Model

  const event: any = {
    Records: [
      {
        body: {
          userId,
        },
      },
    ],
  }
  Model = {
    query: jest.fn(() => Model),
    using: jest.fn(() => Model),
    eq: jest.fn(() => Model),
    exec: jest.fn(() => new Promise(res => res([]))),
  }

  mockedConnectionModel.query.mockImplementation(() => Model)
  mockedManagementClient.prototype.getUser = jest.fn().mockResolvedValueOnce({
    identities: [{provider: 'github', access_token: undefined}],
  })

  console.log(await start(event))
})
