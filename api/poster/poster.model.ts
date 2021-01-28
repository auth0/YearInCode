import dynamoose from '@api/lib/db'
import {PosterDocument, PosterSteps} from '@nebula/types/poster'

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
