import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import {Typography, Button} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'
import YoutubeIcon from '@assets/svg/youtube-logo.svg'

const ShowcaseGrid = () => {
  return (
    <section
      id="showcase"
      className="relative flex flex-col items-center flex-1 min-h-screen px-6 py-4 space-y-32 overflow-hidden"
    >
      <header className="flex flex-col items-center space-y-16 text-center">
        <div className="flex flex-col items-center space-y-8">
          <Typography className="font-semibold" variant="h1">
            Want to see how we built this?
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl text-white opacity-60"
          >
            Checkout our github repo below to see how we utilized Next.js, Auth0
            social login and github’s API to create your custom poster.
          </Typography>
        </div>

        <div className="flex items-center space-x-6">
          <Button href="#" icon={<YoutubeIcon />}>
            See How it Works
          </Button>

          <Button href="#" icon={<GitHubIcon />}>
            Check GitHub Repo
          </Button>
        </div>
      </header>

      <div className="flex flex-col items-center">
        <Link href="/posters/generate" passHref>
          <Button
            icon={<GitHubIcon />}
            className="relative z-10"
            color="primary"
            size="large"
          >
            Connect with GitHub
          </Button>
        </Link>

        <Grid />
      </div>
    </section>
  )
}

const Grid: React.FC = () => (
  <div className="flex space-x-12 -mt-28">
    {new Array(4).fill(null).map((_, i) => (
      <Column className={clsx({'mt-16': (i + 1) % 2 === 0})} key={i} />
    ))}
  </div>
)

interface ColumnProps {
  className: string
}

const Column: React.FC<ColumnProps> = ({className}) => (
  <div className={clsx('flex flex-col space-y-6', className)}>
    {new Array(4).fill(null).map((_, i) => (
      <div className="border border-gray-400 rounded-sm" key={i}>
        <Image
          src={
            'http://localhost:4569/nebula-serverless-poster-bucket-dev/joserfelix-poster-2020-7epu3l-1800x2400.png'
          }
          width={320}
          height={424}
          objectFit="cover"
          className="bg-gray-200"
        />
      </div>
    ))}
  </div>
)

export default ShowcaseGrid
