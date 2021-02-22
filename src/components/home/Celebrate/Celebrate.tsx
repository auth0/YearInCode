import Link from 'next/link'
import React from 'react'

import {Button, RippleArrow, Typography} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'

const Hero = () => {
  return (
    <section
      id="celebrate"
      className="relative flex flex-col items-center justify-around flex-1 min-h-screen px-6 py-4 overflow-hidden"
    >
      <header className="flex flex-col items-center space-y-16 text-center">
        <div className="flex flex-col items-center space-y-8">
          <Typography
            variant="body2"
            className="font-semibold tracking-wide uppercase"
          >
            YOUR YEAR IN CODE
          </Typography>
          <Typography className="font-semibold" variant="h1">
            In a single year you generated a lot <br />
            of beauty... see it all in one place below.
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl leading-relaxed text-white opacity-60"
          >
            Auth0 allows you to quickly connect any social provider to your
            website, including GitHub login. Authenticate using your GitHub
            account to generate a poster of your own. Your year in code :)
          </Typography>
        </div>

        <Link href="/posters/generate" passHref>
          <Button icon={<GitHubIcon />} color="primary" size="large">
            Connect with GitHub
          </Button>
        </Link>
      </header>

      <RippleArrow
        href="#showcase"
        aria-label="Learn more about Nebula"
        className="mt-24 mb-16 lg:mb-0 lg:mt-0"
      />
    </section>
  )
}

export default Hero
