import axios from 'axios'
import JSZip from 'jszip'
import {saveAs} from 'file-saver'

import {constants} from '@lib/common'
import {PosterImageSizes} from '@nebula/types/poster'

export const text = 'Check out my Year in Code!'
export const encodedText = encodeURIComponent(text)

export const hashtags = 'yearincode,auth0'
export const encodedHashtags = encodeURIComponent(hashtags)

async function downloadImage(url: string) {
  const response = await axios.get(url, {
    responseType: 'arraybuffer',
  })

  return Buffer.from(response.data, 'binary').toString('base64')
}

export async function generateDownloadPack(
  posterImages: PosterImageSizes,
  posterSlug: string,
) {
  const zip = new JSZip()

  const imageMap = new Map()

  const promises = Object.entries(posterImages).map(async ([dest, fileName]) =>
    imageMap.set(
      dest,
      await downloadImage(`${constants.site.cloudfront_url}/${fileName}`),
    ),
  )

  await Promise.all(promises)

  zip.file('instagram-1080x1080.png', imageMap.get('instagram'), {base64: true})
  zip.file('card-1280x680.png', imageMap.get('openGraph'), {base64: true})
  zip.file('poster-1800x2400.png', imageMap.get('highQualityPoster'), {
    base64: true,
  })

  const content = await zip.generateAsync({type: 'blob'})
  saveAs(content, posterSlug + '-images.zip')
}
