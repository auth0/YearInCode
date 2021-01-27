import clsx from 'clsx'
import React from 'react'
import Link from 'next/link'

import {Typography, Button} from '@components/ui'
import GitHubIcon from '@assets/svg/github-logo.svg'
import YoutubeIcon from '@assets/svg/youtube-logo.svg'

const ShowcaseGrid = () => {
  return (
    <section
      id="showcase"
      className="relative flex flex-1 flex-col items-center px-6 py-4 min-h-screen overflow-hidden space-y-32"
    >
      <header className="flex flex-col items-center text-center space-y-16">
        <div className="flex flex-col items-center space-y-8">
          <Typography className="font-semibold" variant="h1">
            We don’t want to keep secrets.
            <br />
            See how we build Death Star.
          </Typography>
          <Typography
            variant="h6"
            as="p"
            className="max-w-2xl text-white opacity-60"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed eget
            justo mauris. Proin egestas vehicula posuere. In sed erat ut lectus
            hendrerit.
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
        <Link href="/poster" passHref>
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
  <div className="flex -mt-28 space-x-12">
    {new Array(4).fill(null).map((_, i) => (
      <Column className={clsx({'mt-16': (i + 1) % 2 === 0})} key={i} />
    ))}
  </div>
)

interface ColumnProps {
  className: string
}

const Column: React.FC<ColumnProps> = ({className}) => (
  <div className={clsx('flex flex-col space-y-8', className)}>
    {new Array(4).fill(null).map((_, i) => (
      <div key={i} style={{height: 424}} className="w-80 bg-gray-200"></div>
    ))}
  </div>
)

export default ShowcaseGrid
