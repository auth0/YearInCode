import * as React from 'react'
import Link from 'next/link'

import {GoToRepoButton} from '@components/common'
import {Alert, Button, ProgressBar, Typography} from '@components/ui'
import YoutubeIcon from '@assets/svg/youtube-logo.svg'
import {PosterSteps} from '@nebula/types/poster'

import {steps} from './LoadingView.utils'

interface LoadingProps {
  step: PosterSteps
  wsDisconnected: boolean
  posterSlug: string
}

const Loading: React.FC<LoadingProps> = ({
  step,
  wsDisconnected,
  posterSlug,
}) => {
  const isReady = step === PosterSteps.READY
  const title = steps[step].title
  const subtitle = steps[step].subtitle
  const completionPercent = steps[step].percent

  return (
    <section className="flex flex-col items-center flex-1 px-4">
      {wsDisconnected && !isReady && (
        <Alert type="warning" className="my-12 animate-fade-in">
          Disconnected. Please Reload!
        </Alert>
      )}

      <div className="flex flex-col items-center justify-center flex-1 space-y-12">
        <ProgressBar className="max-w-md" max={100} value={completionPercent} />

        <header className="flex flex-col items-center space-y-12 text-center whitespace-pre-wrap">
          <Typography
            className="max-w-5xl font-semibold animate-fade-in"
            variant="h1"
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl leading-relaxed text-white opacity-60 animate-fade-in"
          >
            {subtitle}
          </Typography>
        </header>

        {!isReady && (
          <div className="flex items-center space-x-6">
            <Button href="#" icon={<YoutubeIcon />}>
              See How it Works
            </Button>

            <GoToRepoButton />
          </div>
        )}

        {isReady && (
          <Link href="/posters/[slug]" as={`/posters/${posterSlug}`} passHref>
            <Button color="primary" size="large">
              Show My Year in Code
            </Button>
          </Link>
        )}
      </div>

      {!isReady && (
        <Alert type="warning" className="my-12">
          Creating your Year in Code can take one hour. We&apos;ll email you
          when it’s ready!
        </Alert>
      )}
    </section>
  )
}

export default Loading
