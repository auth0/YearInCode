import Link from 'next/link'
import {useRouter} from 'next/router'

import Logo from '@assets/svg/auth0-logo-white.svg'

import DesktopMenu from './DesktopMenu'
import MobileMenu from './MobileMenu'

interface Props {
  isLoggedIn?: boolean
  isUserPoster?: boolean
}

function Header({isLoggedIn = false, isUserPoster}: Props) {
  const {pathname} = useRouter()

  const showGeneratePoster = pathname === '/' || !isUserPoster

  return (
    <header className="flex items-center justify-between px-6 pt-8 sm:px-4">
      <Link href="/" passHref>
        <a>
          <Logo aria-hidden />
          <span className="sr-only">Auth0 Logo</span>
        </a>
      </Link>

      <MobileMenu
        isLoggedIn={isLoggedIn}
        showGeneratePoster={showGeneratePoster}
      />

      <DesktopMenu
        isLoggedIn={isLoggedIn}
        showGeneratePoster={showGeneratePoster}
      />
    </header>
  )
}

export default Header
