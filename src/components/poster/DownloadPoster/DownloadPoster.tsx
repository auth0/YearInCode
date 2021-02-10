import clsx from 'clsx'
import {detect} from 'detect-browser'
import dynamic from 'next/dynamic'

import {Button, Typography} from '@components/ui'
import DownloadIcon from '@assets/svg/download.svg'

import MobileShareButton from './MobileShareButton'

const DesktopShareLinks = dynamic(() => import('./DesktopShareLinks'), {
  ssr: false,
})

const browser = detect()
interface GetPosterProps {
  posterSlug: string
}

const GetPoster: React.FC<GetPosterProps> = ({posterSlug}) => {
  const canMobileShare =
    typeof window !== 'undefined' &&
    navigator.share &&
    browser.name !== 'edge-chromium' &&
    browser.name !== 'safari'

  return (
    <div className="z-10 flex flex-1 flex-col items-center justify-center px-4 space-y-12">
      <header className="flex flex-col items-center text-center space-y-12">
        <Typography className="max-w-5xl font-semibold" variant="h1">
          Your journey is ready!
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl text-white leading-relaxed opacity-60"
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
          <Button icon={<DownloadIcon aria-hidden />}>
            Download Pack — 5MB
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GetPoster
