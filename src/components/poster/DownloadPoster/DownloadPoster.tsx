import * as React from 'react'
import {detect} from 'detect-browser'
import Link from 'next/link'
import {toast} from 'react-toastify'
import clsx from 'clsx'

import {Button, Typography} from '@components/ui'
import DownloadIcon from '@assets/svg/download.svg'
import {
  Poster,
  PosterImageSizes,
  PosterSlugResponse,
} from '@nebula/types/poster'
import {Year} from '@nebula/types/queue'
import {UserProfile} from '@lib/auth'

import MobileShareButton from './MobileShareButton'
import DesktopShareLinks from './DesktopShareLinks'
import {generateDownloadPack} from './DownloadPoster.utils'
import SelectYearPopover from './SelectYearPopover'

const browser = detect()
interface GetPosterProps {
  year: Year
  posterSlug: string
  posterImages: PosterImageSizes
  otherPosters: PosterSlugResponse['otherPosters']
  canGenerateMorePosters: boolean
  isUserPoster: boolean
  posterData: Poster
}

const GetPoster: React.FC<GetPosterProps> = ({
  year,
  posterSlug,
  posterImages,
  otherPosters,
  canGenerateMorePosters,
  isUserPoster,
  posterData,
}) => {
  const [creatingZip, setCreatingZip] = React.useState(false)
  const canMobileShare =
    typeof window !== 'undefined' &&
    navigator.share &&
    browser.name !== 'edge-chromium' &&
    browser.name !== 'safari'

  const sortedOtherPosters = otherPosters.sort((a, b) => a.year - b.year)

  const downloadImagePack = async () => {
    try {
      setCreatingZip(true)
      await generateDownloadPack(posterImages, posterSlug)
    } catch (e) {
      toast.error('Error generating zip.')
    } finally {
      setCreatingZip(false)
    }
  }

  return (
    <section className="z-10 flex flex-col items-center justify-center flex-1 px-4 py-12 space-y-12 -mt-52">
      <header className="z-10 flex flex-col items-center space-y-12 text-center">
        <Typography
          className="justify-center max-w-5xl font-semibold"
          variant="h1"
        >
          {isUserPoster ? 'Your' : `${posterData.name.split(' ')[0]}'s`}{' '}
          {otherPosters.length ? (
            <SelectYearPopover year={year} otherPosters={sortedOtherPosters} />
          ) : (
            `${year}`
          )}{' '}
          journey is ready!
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl leading-relaxed text-white opacity-60"
        >
          Auth0 allows you to quickly connect any social provider to your
          website, including github login. Authenticate using your github
          account to generate a poster of your own. Your year in code :)
        </Typography>
      </header>

      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
        {canMobileShare ? (
          <MobileShareButton posterSlug={posterSlug} year={year} />
        ) : (
          <DesktopShareLinks posterSlug={posterSlug} year={year} />
        )}

        {canGenerateMorePosters && (
          <Link href="/posters/generate?new=true" passHref>
            <Button color="primary">Generate another year</Button>
          </Link>
        )}

        <Button
          loading={creatingZip}
          onPress={downloadImagePack}
          icon={<DownloadIcon aria-hidden />}
        >
          Download Pack — about 5MB
        </Button>
      </div>
    </section>
  )
}

export default GetPoster
