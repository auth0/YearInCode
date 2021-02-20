import Link from 'next/link'

import {Button, Typography} from '@components/ui'
import SittingPersonSVG from '@assets/svg/sitting-person.svg'

const NoGithubActivity = () => {
  return (
    <section className="flex flex-col items-center justify-center flex-1 space-y-8 mt-28">
      <div
        style={{width: 108, height: 108}}
        className="flex items-center justify-center bg-white rounded-full"
      >
        <SittingPersonSVG className="z-10" width={41} height={68} />
      </div>

      <header className="space-y-2">
        <Typography
          className="max-w-lg font-semibold text-center"
          variant="h6"
          as="h1"
        >
          No GitHub activity detected.
        </Typography>
        <Typography
          className="max-w-lg text-center text-gray-300"
          variant="body1"
          as="p"
        >
          I assume you&apos;ve been doing your magic for a top-secret client ;)
        </Typography>
      </header>

      <Link href="/posters/generate?new=true" passHref>
        <Button color="primary">Generate another year</Button>
      </Link>
    </section>
  )
}

export default NoGithubActivity
