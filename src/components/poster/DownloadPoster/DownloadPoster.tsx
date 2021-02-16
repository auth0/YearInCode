import * as React from 'react'
import clsx from 'clsx'
import {detect} from 'detect-browser'
import dynamic from 'next/dynamic'
import {toast} from 'react-toastify'

import {Button, Typography} from '@components/ui'
import DownloadIcon from '@assets/svg/download.svg'
import {PosterImageSizes} from '@nebula/types/poster'
import {Spinner} from '@components/ui'

import MobileShareButton from './MobileShareButton'
import {generateDownloadPack} from './DownloadPoster.utils'

const DesktopShareLinks = dynamic(() => import('./DesktopShareLinks'), {
  ssr: false,
})

const browser = detect()
interface GetPosterProps {
  posterSlug: string
  posterImages: PosterImageSizes
}

const GetPoster: React.FC<GetPosterProps> = ({posterSlug, posterImages}) => {
  const [creatingZip, setCreatingZip] = React.useState(false)
  const canMobileShare =
    typeof window !== 'undefined' &&
    navigator.share &&
    browser.name !== 'edge-chromium' &&
    browser.name !== 'safari'

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
    <section className="z-10 flex flex-col items-center justify-center flex-1 px-4 py-12 space-y-12">
      <header className="flex flex-col items-center space-y-12 text-center">
        <Typography className="max-w-5xl font-semibold" variant="h1">
          Your journey is ready!
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl leading-relaxed text-white opacity-60"
        >
          Your Death Star presenting your developer’s journey. We gathered all
          your projects and combined them into piece of art. You can print it
          and hang on the wall, set as wallpaper, or share with friends.
        </Typography>
      </header>

      <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
        {canMobileShare ? (
          <MobileShareButton posterSlug={posterSlug} />
        ) : (
          <DesktopShareLinks posterSlug={posterSlug} />
        )}

        <div
          className={clsx(
            'flex flex-col items-center space-y-4',
            'sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0',
          )}
        >
          <Button
            loading={creatingZip}
            onPress={downloadImagePack}
            icon={<DownloadIcon aria-hidden />}
          >
            Download Pack — about 5MB
          </Button>
        </div>
      </div>
    </section>
  )
}

export default GetPoster
