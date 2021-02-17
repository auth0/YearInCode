import {toast} from 'react-toastify'

import {Button} from '@components/ui'
import {constants} from '@lib/common'
import ShareIcon from '@assets/svg/share.svg'
import {Year} from '@nebula/types/queue'

import {text} from './DownloadPoster.utils'

interface MobileShareButtonProps {
  posterSlug: string
  year: Year
}

const MobileShareButton: React.FC<MobileShareButtonProps> = ({
  posterSlug,
  year,
}) => {
  const posterUrl = `${constants.site.url}/posters/${posterSlug}`

  const shareData = {
    title: 'Year In Code',
    text: text(year),
    url: posterUrl,
  }

  const handleClick = async () => {
    try {
      await navigator.share(shareData)
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('Error opening share pop-up.')
      }
    }
  }

  return (
    <Button
      onPress={handleClick}
      aria-label="Open native share pop-up"
      icon={<ShareIcon aria-hidden />}
    />
  )
}

export default MobileShareButton
