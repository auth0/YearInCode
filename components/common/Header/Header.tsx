import Link from 'next/link'

import {Typography} from '@components/ui'

function Header({user, loading}) {
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
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          {!loading &&
            (user ? (
              <>
                <li>
                  <Link href="/profile">
                    <a>Client-rendered profile</a>
                  </Link>
                </li>
                <li>
                  <Link href="/advanced/ssr-profile">
                    <a>Server rendered profile (advanced)</a>
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
