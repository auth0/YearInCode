import React from 'react'
import clsx from 'clsx'
import NextLink from 'next/link'

import {Typography} from '@components/ui'

import {links, socials} from './Footer.utils'

const Footer = () => {
  return (
    <footer
      className={clsx(
        'relative flex flex-col items-center justify-start px-4 py-6 text-center',
        'lg:flex-row lg:justify-between',
      )}
    >
      <Typography variant="body1" className="order-3 opacity-60 lg:order-none">
        © 2013 - {new Date().getFullYear()} Auth0® Inc. All Rights Reserved.
      </Typography>
      <Socials className="order-1 mb-4 lg:order-none lg:mb-0" />
      <Links className="order-2 mb-4 lg:order-none lg:mb-0" />
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
      <a key={id} href={link}>
        <Icon className="hover:opacity-100 opacity-60" />
      </a>
    ))}
  </ul>
)

interface LinksProps {
  className?: string
}

const Links: React.FC<LinksProps> = ({className}) => (
  <ul className={clsx('flex space-x-6', className)}>
    {links.map(link => (
      <Link key={link.name} {...link} />
    ))}
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

export default Footer
