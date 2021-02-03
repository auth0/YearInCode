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
          We want to celebrate{' '}
          <span className={s.underlineText}>Auth0 Actions</span> &{' '}
          <span className={s.underlineText}>Github Integration</span> with you.{' '}
        </Typography>
        <Typography
          variant="h6"
          as="p"
          className="max-w-2xl text-white leading-relaxed opacity-60"
        >
          We focused on presenting the work you do everyday — your journey. Are
          you ready for yours?
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
