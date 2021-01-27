import dynamoose from '@api/lib/db'
import {
  PosterDocument,
  PosterSteps,
  PosterUserStatus,
} from '@nebula/types/poster'

const schema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      hashKey: true,
    },
    step: {
      type: String,
      enum: Object.values(PosterSteps),
      required: true,
    },
    connectionId: {
      type: String,
      index: {
        name: 'connectionIdIndex',
        global: true,
        project: true,
        rangeKey: 'connectionStatus',
      },
    },
    connectionStatus: {
      type: String,
      enum: Object.values(PosterUserStatus),
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  },
)

const PosterModel = dynamoose.model<PosterDocument>(
  process.env.POSTER_TABLE,
  schema,
  {
    create: false,
  },
)

export default PosterModel
