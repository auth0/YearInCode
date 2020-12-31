import React from 'react'
import Link from 'next/link'

import {RippleArrow, Typography, Button} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'

const MeetDeathStar = () => {
  return (
    <section
      id="meet-death-star"
      className="relative flex flex-1 flex-col items-center justify-around px-6 py-4 min-h-screen overflow-hidden"
    >
      <header className="flex flex-col items-center text-center space-y-16">
        <div className="flex flex-col items-center space-y-8">
          <Typography
            variant="body2"
            className="font-semibold tracking-wide uppercase"
          >
            Death Star — your journey
          </Typography>
          <Typography className="font-semibold" variant="h1">
            Meet Death Star — the visual representation of your journey.
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl text-white leading-relaxed opacity-60"
          >
            Auth0 appreciates the journey you as developer are on in constantly
            improving your skill set to keep innovating in new ways.
          </Typography>
        </div>

        <Link href="/death-star" passHref>
          <Button icon={<GitHubIcon />} color="primary" size="large">
            Connect with GitHub
          </Button>
        </Link>
      </header>

      <RippleArrow
        href="#showcase"
        aria-label="Learn more about Nebula"
        className="mb-16 mt-24 lg:mb-0 lg:mt-0"
      />
    </section>
  )
}

export default MeetDeathStar
