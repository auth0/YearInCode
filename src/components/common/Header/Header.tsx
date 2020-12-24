import Link from 'next/link'

import Logo from '@assets/svg/auth0-logo-white.svg'

function Header() {
  return (
    <header className="flex items-center justify-center py-6">
      <Link href="/" passHref>
        <a>
          <Logo aria-hidden />
          <span className="sr-only">Auth0 Logo</span>
        </a>
      </Link>
    </header>
  )
}

export default Header
