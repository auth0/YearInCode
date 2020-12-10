import Link from 'next/link'

import {Typography} from '@components/ui'
import {useAuth} from '@lib/auth'

function Header() {
  const {user, isLoading} = useAuth()

  return (
    <header className="container flex items-center justify-between mx-auto py-6">
      <Typography variant="h3" as="h1" className="text-flamingo font-bold">
        Nebula
      </Typography>
      <nav>
        <ul className="flex space-x-8">
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          {!isLoading &&
            (user ? (
              <>
                <li>
                  <Link href="/profile">
                    <a>Client-rendered profile</a>
                  </Link>
                </li>

                <li>
                  <a href="/api/logout">Logout</a>
                </li>
              </>
            ) : (
              <li>
                <a href="/api/login">Login</a>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
