import clsx from 'clsx'

import {Typography, Button} from '@components/ui'
import TwitterIcon from '@assets/svg/twitter-logo.svg'
import PrinterIcon from '@assets/svg/printer.svg'
import DownloadIcon from '@assets/svg/download.svg'

const GetPoster = () => {
  return (
    <div className="z-10 flex flex-1 flex-col items-center justify-center -mt-28 space-y-12">
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

      <div
        className={clsx(
          'flex flex-col items-center justify-center space-y-4',
          'md:flex-row md:items-center md:space-x-6 md:space-y-0',
        )}
      >
        <Button href="#" icon={<PrinterIcon />}>
          Print
        </Button>

        <Button href="#" icon={<DownloadIcon />}>
          Download Pack — 5MB
        </Button>

        <Button href="#" icon={<TwitterIcon />}>
          Share
        </Button>
      </div>
    </div>
  )
}

export default GetPoster
