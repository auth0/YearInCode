import cheerio from 'cheerio'

import {PosterImageSizes, PosterSteps} from '@nebula/types/poster'

import PosterModel from '../poster.model'

import * as helpers from './helpers'
import {sendPosterStatistics} from './send'

const posterImages: PosterImageSizes = {
  twitter: 'twitter.png',
  highQualityPoster: 'high-quality.png',
  instagram: 'instagram.png',
  openGraph: 'openGraph.png',
}

const posterSlug = 'slug'

describe('sendPosterStatistics', () => {
  afterEach(jest.clearAllMocks)

  describe("when there's no posters in the current week", () => {
    it("sends an email with 'No new posters this week'", async () => {
      /**
       * Due to race conditions, this test might fail thus the need of mocking
       * the function bellow
       */
      jest.spyOn(helpers, 'getCreatedPostersBetween').mockResolvedValueOnce([])
      const sendEmailSpy = jest
        .spyOn(helpers, 'sendEmail')
        .mockResolvedValueOnce()
      await sendPosterStatistics()
      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.stringContaining('No new posters this week'),
      )
    })
  })

  describe('when there are 2 posters in ready state and different languages in the current week', () => {
    afterEach(async () => {
      ;['user1', 'user2', 'user3'].forEach(async userId => {
        await PosterModel.delete({posterSlug, userId})
      })
    })

    it('appends each separate langauge/total as a row in the email', async () => {
      const typescriptPoster = new PosterModel({
        posterSlug,
        userId: 'user1',
        year: 2020,
        step: PosterSteps.READY,
        posterData: '{"dominantLanguage":"typescript"}',
        posterImages,
      })

      await typescriptPoster.save()

      const haskellPoster = new PosterModel({
        posterSlug,
        userId: 'user2',
        year: 2020,
        step: PosterSteps.READY,
        posterData: '{"dominantLanguage":"haskell"}',
        posterImages,
      })

      await haskellPoster.save()

      const goPoster = new PosterModel({
        posterSlug,
        userId: 'user3',
        year: 2020,
        step: PosterSteps.FAILED,
        posterData: '{"dominantLanguage":"golang"}',
        posterImages,
      })

      await goPoster.save()

      const sendEmailSpy = jest
        .spyOn(helpers, 'sendEmail')
        .mockResolvedValueOnce()
      await sendPosterStatistics()

      const $ = cheerio.load(sendEmailSpy.mock.calls[0][0])

      const rows = $('tr')
      expect(rows).toHaveLength(2)

      const typescriptRowContent = rows.first().text()
      expect(typescriptRowContent).toContain('typescript')
      expect(typescriptRowContent).toContain('1')

      const haskellRowContent = rows.last().text()
      expect(haskellRowContent).toContain('haskell')
      expect(haskellRowContent).toContain('1')
    })
  })
})
