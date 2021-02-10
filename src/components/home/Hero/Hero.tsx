import Link from 'next/link'

import {RippleArrow, Typography, Button} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex flex-1 flex-col items-center justify-around px-6 py-4 min-h-screen overflow-hidden"
    >
      <header className="flex flex-col items-center text-center space-y-8">
        <Typography
          variant="body2"
          className="font-semibold tracking-wide uppercase"
        >
          YOUR YEAR IN CODE
        </Typography>
        <Typography className="font-semibold" variant="h1">
          You’re the heart of innovation.
          <br />
          So share your journey.
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl text-white leading-relaxed opacity-60"
        >
          Auth0 loves developers and we wanted to create something that would
          reflect just how awesome the work you and your peers do every day is.
        </Typography>
      </header>

      <RippleArrow
        href="#celebrate"
        aria-label="Learn more about Nebula"
        className="mb-16 mt-24 lg:mb-0 lg:mt-0"
      />
    </section>
  )
}

export default Hero
