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
      rangeKey: true,
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
  },
)

export default ConnectionModel
