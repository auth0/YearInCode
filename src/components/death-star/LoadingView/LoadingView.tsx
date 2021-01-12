import * as React from 'react'
import Link from 'next/link'

import {Alert, Button, ProgressBar, Typography} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'
import YoutubeIcon from '@assets/svg/youtube-logo.svg'
import {DeathStarSteps} from '@nebula/types/death-star'

import {steps} from './LoadingView.utils'

interface LoadingProps {
  step: DeathStarSteps
  wsDisconnected: boolean
}

const Loading: React.FC<LoadingProps> = ({step, wsDisconnected}) => {
  const isReady = step === DeathStarSteps.READY
  const title = steps[step].title
  const subtitle = steps[step].subtitle
  const completionPercent = steps[step].percent

  return (
    <section className="flex flex-1 flex-col items-center px-4">
      {wsDisconnected && (
        <Alert type="warning" className="my-12">
          Disconnected. Please Reload!
        </Alert>
      )}

      <div className="flex flex-1 flex-col items-center justify-center space-y-12">
        <ProgressBar className="max-w-md" max={100} value={completionPercent} />

        <header className="flex flex-col items-center text-center whitespace-pre-wrap space-y-12">
          <Typography
            className="max-w-5xl font-semibold animate-fade-in"
            variant="h1"
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl text-white leading-relaxed opacity-60 animate-fade-in"
          >
            {subtitle}
          </Typography>
        </header>

        {!isReady && (
          <div className="flex items-center space-x-6">
            <Button href="#" icon={<YoutubeIcon />}>
              See How it Works
            </Button>

            <Button href="#" icon={<GitHubIcon />}>
              Check GitHub Repo
            </Button>
          </div>
        )}

        {isReady && (
          <Link href="/death-star/ready" passHref>
            <Button color="primary" size="large">
              Show My Death Star
            </Button>
          </Link>
        )}
      </div>

      {!isReady && (
        <Alert type="warning" className="my-12">
          Creating your Death Star can take around an hour. We&apos;ll email you
          when it’s ready!
        </Alert>
      )}
    </section>
  )
}

export default Loading
