import clsx from 'clsx'

import {Button} from '@components/ui'
import TwitterIcon from '@assets/svg/twitter-logo.svg'
import LinkedInLogo from '@assets/svg/linkedin-logo.svg'
import FacebookLogo from '@assets/svg/facebook-logo.svg'
import PrinterIcon from '@assets/svg/printer.svg'
import {constants} from '@lib/common'
import {Year} from '@nebula/types/queue'

import {encodedHashtags, encodedText} from './DownloadPoster.utils'
import MobileShareButton from './MobileShareButton'

interface DesktopShareLinksProps {
  posterSlug: string
  year: Year
}

const DesktopShareLinks: React.FC<DesktopShareLinksProps> = ({
  posterSlug,
  year,
}) => {
  // Handle Safari and Edge Chromium edge cases
  const canMobileShare = typeof window !== 'undefined' && navigator.share

  const encodedPosterUrl = encodeURIComponent(
    `${constants.site.url}/posters/${posterSlug}`,
  )

  return (
    <div
      className={clsx(
        'flex items-center justify-center space-x-4',
        'sm:space-x-6 sm:space-y-0',
      )}
    >
      <Button
        target="__blank"
        href={`https://twitter.com/intent/tweet?text=${encodedText(
          year,
        )}&hashtags=${encodedHashtags}&url=${encodedPosterUrl}`}
        rel="noopener noreferrer"
        icon={<TwitterIcon aria-hidden />}
        aria-label=" Share on Twitter"
      />
      <Button
        target="__blank"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedPosterUrl}`}
        rel="noopener noreferrer"
        icon={<LinkedInLogo aria-hidden />}
        aria-label="Share on LinkedIn"
      />
      {/* TODO: Get Facebook app_id */}
      <Button
        target="__blank"
        href={`https://www.facebook.com/dialog/share?app_id=8485179393&display=popup&href=${encodedPosterUrl}&hashtags=${encodedHashtags}`}
        rel="noopener noreferrer"
        icon={<FacebookLogo aria-hidden />}
        aria-label="Share on Facebook"
      />
      {canMobileShare && (
        <MobileShareButton posterSlug={posterSlug} year={year} />
      )}
    </div>
  )
}

export default DesktopShareLinks
