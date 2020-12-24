import * as React from 'react'
import Link from 'next/link'

import {Alert, Button, ProgressBar, Typography} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'
import YoutubeIcon from '@assets/svg/youtube-logo.svg'

import {steps} from './LoadingView.utils'

const Loading = () => {
  // TODO: Change steps through server requests
  const [currentStep, setCurrentStep] = React.useState(0)

  const isLastStep = currentStep === steps.length - 1
  const title = steps[currentStep].title
  const subtitle = steps[currentStep].subtitle
  const completionPercent = ((currentStep + 1) / steps.length) * 100

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      !isLastStep && setCurrentStep(currentStep + 1)
    }, 2000)

    return () => clearInterval(intervalId)
  })

  return (
    <section className="flex flex-1 flex-col items-center px-4">
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

        {!isLastStep && (
          <div className="flex items-center space-x-6">
            <Button href="#" icon={<YoutubeIcon />}>
              See How it Works
            </Button>

            <Button href="#" icon={<GitHubIcon />}>
              Check GitHub Repo
            </Button>
          </div>
        )}

        {isLastStep && (
          <Link href="/death-star/ready" passHref>
            <Button color="primary" size="large">
              Show My Death Star
            </Button>
          </Link>
        )}
      </div>

      {!isLastStep && (
        <Alert type="warning" className="my-12">
          Creating your Death Star can take around an hour. We&apos;ll email you
          when it’s ready!
        </Alert>
      )}
    </section>
  )
}

export default Loading
