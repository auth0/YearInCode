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
        verticalCard: {type: String, required: true},
      },
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
    create: process.env.NODE_ENV === 'test' ? true : false,
  },
)

export default PosterModel
