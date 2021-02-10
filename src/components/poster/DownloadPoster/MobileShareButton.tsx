import {toast} from 'react-toastify'

import {Button} from '@components/ui'
import ShareIcon from '@assets/svg/share.svg'

import {siteUrl, text} from './DownloadPoster.utils'

interface MobileShareButtonProps {
  posterSlug: string
}

const MobileShareButton: React.FC<MobileShareButtonProps> = ({posterSlug}) => {
  const posterUrl = `${siteUrl}/posters/${posterSlug}`

  const shareData = {
    title: 'Year In Code',
    text,
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
