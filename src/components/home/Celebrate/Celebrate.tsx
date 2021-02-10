import {RippleArrow, Typography} from '@components/ui'

import s from './Celebrate.module.css'

const Hero = () => {
  return (
    <section
      id="celebrate"
      className="relative flex flex-1 flex-col items-center justify-around px-6 py-4 min-h-screen overflow-hidden"
    >
      <header className="flex flex-col items-center text-center space-y-8">
        <Typography className="font-semibold" variant="h1">
          In a single year you generated a lot <br />
          of beauty... see it all in one place below.
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl text-white leading-relaxed opacity-60"
        >
          Auth0 allows you to quickly connect any social provider to your
          website, including github login. Authenticate using your github
          account to generate a poster of your own. Your year in code :)
        </Typography>
      </header>

      <RippleArrow
        href="#meet-poster"
        aria-label="Learn more about Nebula"
        className="mb-16 mt-24 lg:mb-0 lg:mt-0"
      />
    </section>
  )
}

export default Hero
