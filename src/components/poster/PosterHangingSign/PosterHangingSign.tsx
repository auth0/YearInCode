import Image from 'next/image'

import RopeSVG from '@assets/svg/rope.svg'

import s from './PosterHangingSign.module.css'

interface PosterHangingSignProps {
  src: string
  name: string
}

const PosterHangingSign: React.FC<PosterHangingSignProps> = ({name, src}) => {
  return (
    <div className={s.container}>
      <RopeSVG className={s.rope} aria-hidden />
      <div className="border border-gray-500">
        <Image
          src={src}
          width={420}
          height={700}
          quality={85}
          objectFit="cover"
          priority={true}
          alt={`${name} poster`}
        />
      </div>
      <div className={s.shadow} />
      <div className="absolute bottom-0 w-full h-40 bg-dark-slate-gray-500" />
    </div>
  )
}

export default PosterHangingSign
