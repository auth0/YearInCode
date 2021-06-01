import React from 'react'
import clsx from 'clsx'
import NextLink from 'next/link'

import {Button, Typography} from '@components/ui'
import Logo from '@assets/svg/auth0-logo-white.svg'

import {socials} from './Footer.utils'

const Footer = () => {
  const [displayTermsCard, setDisplayTermsCard] = React.useState(false)

  React.useEffect(() => {
    if (!displayTermsCard) return
    document.getElementById('terms')?.scrollIntoView()
  }, [displayTermsCard])

  const hideTermsCard = () => setDisplayTermsCard(false)
  const showTermsCard = () => setDisplayTermsCard(true)

  return (
    <footer className="flex flex-col px-4 py-6">
      {displayTermsCard && <Terms onClickAccept={hideTermsCard} />}
      <div
        className={clsx(
          'relative flex flex-col items-center justify-start text-center',
          'lg:flex-row lg:justify-between',
        )}
      >
        <Typography
          variant="body1"
          className="order-3 opacity-60 lg:order-none"
        >
          © 2013 - {new Date().getFullYear()} Auth0® Inc. All Rights Reserved.
        </Typography>
        <Socials className="order-1 mb-4 lg:order-none lg:mb-0" />
        <Links
          className="order-2 mb-4 lg:order-none lg:mb-0"
          onClickTerms={showTermsCard}
        />
      </div>
    </footer>
  )
}

interface SocialsProps {
  className?: string
}

const Socials: React.FC<SocialsProps> = ({className}) => (
  <ul
    className={clsx(
      'flex space-x-6',
      'lg:absolute lg:right-1/2 lg:transform lg:translate-x-1/2',
      className,
    )}
  >
    {socials.map(({icon: Icon, link, id}) => (
      <a key={id} href={link} target="_blank" rel="noopener noreferrer">
        <Icon className="hover:opacity-100 opacity-60" />
      </a>
    ))}
  </ul>
)

interface LinksProps {
  className?: string
  onClickTerms: () => void
}

const Links: React.FC<LinksProps> = ({className, onClickTerms}) => (
  <ul className={clsx('flex space-x-6', className)}>
    <Typography
      variant="body1"
      as="button"
      className="text-white hover:text-opacity-100 text-opacity-60 focus:outline-none"
      onClick={onClickTerms}
    >
      Terms and Conditions
    </Typography>
  </ul>
)

interface LinkProps {
  name: string
  href: string
}

const Link: React.FC<LinkProps> = ({name, href}) => {
  return (
    <li>
      <NextLink href={href} passHref>
        <Typography
          variant="body1"
          as="a"
          className="text-white hover:text-opacity-100 text-opacity-60"
        >
          {name}
        </Typography>
      </NextLink>
    </li>
  )
}

type TermsProps = {onClickAccept: () => void}

const Terms: React.FC<TermsProps> = ({onClickAccept}) => (
  <div
    id="terms"
    className="lg:flex-column px-8 py-6 text-center border border-gray-400 rounded-sm mb-6"
  >
    <Typography className="font-bold mb-3" variant="h5">
      Terms &amp; Conditions
    </Typography>
    <Typography variant="body1" className="text-justify mb-6">
      Thank you for using <Bold>Year-in-code</Bold> built with love by{' '}
      <Bold>Auth0</Bold>. The data used by this app is used solely for the
      purpose of displaying your year-in-code to you, we do not consume, collect
      or use this data for any other purpose. If you would like to delete a
      record of your poster after the fact, email{' '}
      <ExternalLink
        to="mailto:developers@auth0.com"
        label="developers@auth0.com"
      />{' '}
      and we will immediately delete your posters. The posters are based only on
      your publicly available Github data only, if you would like to see your
      private contributions as well{' '}
      <ExternalLink
        to="https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/publicizing-or-hiding-your-private-contributions-on-your-profile"
        label="follow these instructions"
      />
      . Thank you and enjoy!
    </Typography>
    <div className="flex flex-col sm:flex-row items-center sm:justify-between">
      <Logo className="mb-6 lg:mb-0" />
      <Button color="primary" onPress={onClickAccept}>
        Click to accept
      </Button>
    </div>
  </div>
)

const ExternalLink: React.FC<{to: string; label: string}> = ({to, label}) => (
  <a href={to} target="_blank" rel="noreferrer">
    <Bold>{label}</Bold>
  </a>
)

const Bold: React.FC = ({children}) => (
  <span className="font-bold">{children}</span>
)

export default Footer
