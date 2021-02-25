import dynamoose from '@api/lib/db'
import {ConnectionDocument} from '@nebula/types/poster'

const schema = new dynamoose.Schema(
  {
    connectionId: {
      type: String,
      required: true,
      hashKey: true,
    },
    userId: {
      type: String,
      required: true,
      index: {
        name: 'userIdIndex',
        global: true,
        project: true,
      },
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  },
)

const ConnectionModel = dynamoose.model<ConnectionDocument>(
  process.env.CONNECTION_TABLE,
  schema,
  {
    create: false,
    throughput: 'ON_DEMAND',
    ...(process.env.NODE_ENV === 'test' && {
      create: true,
      waitForActive: {
        enabled: true,
        check: {
          frequency: 0,
        },
      },
    }),
  },
)

export default ConnectionModel
