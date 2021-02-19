import * as React from 'react'
import {motion} from 'framer-motion'
import Link from 'next/link'

import MenuIcon from '@assets/svg/menu.svg'
import XIcon from '@assets/svg/x.svg'
import {Typography} from '@components/ui'

interface MobileMenuProps {
  isLoggedIn: boolean
  showGeneratePoster: boolean
}

const variants = {
  open: {
    opacity: 1,
  },
  closed: {
    opacity: 0,
  },
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isLoggedIn,
  showGeneratePoster,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="block sm:hidden">
      <button onClick={handleClick}>
        {isOpen ? (
          <XIcon className="w-8 h-8" />
        ) : (
          <MenuIcon className="w-8 h-8" aria-hidden />
        )}
        <span className="sr-only">Open navigation menu</span>
      </button>

      <motion.ul
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        className="absolute left-0 z-50 w-screen px-4 py-5 space-y-4 text-right bg-black bg-opacity-95"
      >
        {isLoggedIn ? (
          <>
            {showGeneratePoster && (
              <li>
                <Link href="/posters/generate" passHref>
                  <Typography variant="h3" as="a" className="text-flamingo-500">
                    My poster
                  </Typography>
                </Link>
              </li>
            )}
            <li>
              <Link href="/api/logout" passHref>
                <Typography variant="h3" as="a">
                  Log out
                </Typography>
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link href="/posters/generate" passHref>
              <Typography variant="h3" as="li">
                Connect with GitHub
              </Typography>
            </Link>
          </li>
        )}
      </motion.ul>
    </div>
  )
}

export default MobileMenu
