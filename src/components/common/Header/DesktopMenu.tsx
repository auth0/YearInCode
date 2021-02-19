import Link from 'next/link'

import {Button} from '@components/ui'

interface DesktopMenuProps {
  isLoggedIn: boolean
  showGeneratePoster: boolean
}

const DesktopMenu: React.FC<DesktopMenuProps> = ({
  isLoggedIn,
  showGeneratePoster,
}) => {
  return (
    <div className="hidden space-x-4 sm:flex">
      {isLoggedIn ? (
        <>
          {showGeneratePoster && (
            <Link href="/posters/generate" passHref>
              <Button color="primary">Go To My poster</Button>
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
  )
}

export default DesktopMenu
