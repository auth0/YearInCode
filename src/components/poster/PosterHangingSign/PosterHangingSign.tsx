import Image from 'next/image'

import s from './PosterHangingSign.module.css'

interface PosterHangingSignProps {
  src: string
}

const PosterHangingSign: React.FC<PosterHangingSignProps> = ({src}) => {
  return (
    <div className={s.container}>
      <div className="border border-gray-500">
        <Image src={src} width={440} height={716} />
      </div>
      <div className={s.shadow} />
      <div className="absolute bottom-0 w-full bg-black h-44" />
    </div>
  )
}

export default PosterHangingSign
