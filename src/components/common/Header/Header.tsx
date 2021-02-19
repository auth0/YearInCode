import Link from 'next/link'
import {useRouter} from 'next/router'

import {Button} from '@components/ui'
import Logo from '@assets/svg/auth0-logo-white.svg'

interface Props {
  isLoggedIn?: boolean
  isUserPoster?: boolean
}

function Header({isLoggedIn = false, isUserPoster}: Props) {
  const {pathname} = useRouter()

  const showGeneratePoster = pathname === '/' || !isUserPoster

  return (
    <header className="flex items-center justify-between px-4 pt-8">
      <Link href="/" passHref>
        <a>
          <Logo aria-hidden />
          <span className="sr-only">Auth0 Logo</span>
        </a>
      </Link>

      <div className="flex space-x-4">
        {isLoggedIn ? (
          <>
            {showGeneratePoster && (
              <Link href="/posters/generate" passHref>
                <Button color="primary">My poster</Button>
              </Link>
            )}
            <Link href="/api/logout" passHref>
              <Button>Log out</Button>
            </Link>
          </>
        ) : (
          <Link href="/posters/generate" passHref>
            <Button color="primary">Connect with GitHub</Button>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
