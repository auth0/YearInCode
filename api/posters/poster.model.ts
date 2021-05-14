import dynamoose from '@api/lib/db'
import {PosterDocument, PosterSteps} from '@nebula/types/poster'

const schema = new dynamoose.Schema(
  {
    posterSlug: {
      type: String,
      hashKey: true,
    },
    userId: {
      type: String,
      required: true,
      rangeKey: true,
      index: {
        name: 'userIdIndex',
        global: true,
        project: true,
      },
    },
    year: {
      type: Number,
      required: true,
    },
    step: {
      type: String,
      enum: Object.values(PosterSteps),
      required: true,
    },
    posterData: {
      type: String,
    },
    posterImages: {
      type: Object,
      schema: {
        twitter: {type: String, required: true},
        instagram: {type: String, required: true},
        openGraph: {type: String, required: true},
        highQualityPoster: {type: String, required: true},
      },
    },
  },
  {
    saveUnknown: false,
    timestamps: true,
  },
)

const PosterModel = dynamoose.model<PosterDocument>(
  process.env.POSTER_TABLE as string,
  schema,
  {
    create: false,
    throughput: 'ON_DEMAND',
    ...(process.env.NODE_ENV === 'test' && {
      waitForActive: {
        enabled: true,
        check: {
          timeout: 60000,
          frequency: 0,
        },
      },
    }),
  },
)

export default PosterModel
