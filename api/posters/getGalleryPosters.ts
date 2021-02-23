import middy from 'middy'
import {
  doNotWaitForEmptyEventLoop,
  httpErrorHandler,
  httpSecurityHeaders,
} from 'middy/middlewares'
import createHttpError from 'http-errors'

import {shuffle} from '@api/lib/array'
import {logger} from '@nebula/log'
import {PosterGalleryResponse, PosterState} from '@nebula/types/poster'

import PosterModel from './poster.model'

async function getGalleryPosters() {
  try {
    const SCAN_LIMIT = 80

    logger.info(`Scanning ${SCAN_LIMIT} posters`)
    const posterDocuments: Pick<
      PosterState,
      'posterImages' | 'posterData'
    >[] = await PosterModel.scan()
      .limit(SCAN_LIMIT)
      .attributes(['posterImages', 'posterData'])
      .exec()

    logger.info(`Shuffling the result: ${JSON.stringify(posterDocuments)}`)

    const filteredPosters: PosterGalleryResponse = posterDocuments
      .filter(({posterData}) => {
        const parsedPosterData = JSON.parse(posterData)
          .weeks as PosterState['posterData']

        return parsedPosterData.length >= 3
      })
      .map(({posterImages, posterData}) => ({
        posterImages,
        posterData,
      }))
    const shuffledPosters = shuffle(filteredPosters)

    logger.info(`Shuffled! Result: ${JSON.stringify(shuffledPosters)}`)

    return {
      statusCode: 200,
      body: JSON.stringify(
        shuffledPosters.slice(0, 16) as PosterGalleryResponse,
      ),
    }
  } catch (error) {
    logger.error('Failed getting status. Error: ' + error)

    return createHttpError(500, 'ERROR getting gallery posts')
  }
}

const handler = middy(getGalleryPosters)
  .use(httpSecurityHeaders())
  .use(doNotWaitForEmptyEventLoop())
  .use(httpErrorHandler())

export {handler as getGalleryPosters}
