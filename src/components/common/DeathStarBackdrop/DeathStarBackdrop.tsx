import Image from 'next/image'

import s from './DeathStarBackdrop.module.css'

const ImageContainer: React.FC = ({children}) => {
  return (
    <main className={s.imageContainer}>
      <Image
        aria-hidden
        width={500}
        height={500}
        src="/img/poster.png"
        className="opacity-20"
      />
      <div className="container z-10 flex flex-1 flex-col mx-auto">
        {children}
      </div>
    </main>
  )
}

export default ImageContainer
