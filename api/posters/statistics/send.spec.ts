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

describe('sendPosterStatistics', () => {
  afterEach(async () => {
    await PosterModel.delete({posterSlug: 'slug'})
    jest.clearAllMocks()
  })

  describe("when there's no posters in the current week", () => {
    it("sends an email with 'No new posters this week'", async () => {
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
    it('appends each separate langauge/total as a row in the email', async () => {
      const typescriptPoster = new PosterModel({
        posterSlug: 'slug',
        userId: 'user1',
        year: 2020,
        step: PosterSteps.READY,
        posterData: '{"dominantLanguage":"typescript"}',
        posterImages,
      })

      await typescriptPoster.save()

      const haskellPoster = new PosterModel({
        posterSlug: 'slug',
        userId: 'user2',
        year: 2020,
        step: PosterSteps.READY,
        posterData: '{"dominantLanguage":"haskell"}',
        posterImages,
      })

      await haskellPoster.save()

      const goPoster = new PosterModel({
        posterSlug: 'slug',
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

      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.stringContaining('<td>typescript</td><td>1</td>'),
      )

      expect(sendEmailSpy).toHaveBeenCalledWith(
        expect.stringContaining('<td>haskell</td><td>1</td>'),
      )

      expect(sendEmailSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('<td>golang</td><td>1</td>'),
      )
    })
  })
})
