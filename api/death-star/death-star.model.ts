import dynamoose from '@api/lib/db'
import {
  DeathStarDocument,
  DeathStarSteps,
  DeathStarUserStatus,
} from '@nebula/types/death-star'

const schema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      hashKey: true,
    },
    step: {
      type: String,
      enum: Object.values(DeathStarSteps),
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
      enum: Object.values(DeathStarUserStatus),
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  },
)

const DeathStar = dynamoose.model<DeathStarDocument>('DeathStar', schema, {
  create: false,
})

export default DeathStar
