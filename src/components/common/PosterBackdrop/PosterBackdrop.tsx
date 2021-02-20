import Image from 'next/image'

import s from './PosterBackdrop.module.css'

const PosterBackdrop: React.FC = ({children}) => {
  return (
    <div className={s.imageContainer}>
      <Image aria-hidden width={700} height={700} src="/img/poster.png" />
      <div className="container z-10 flex flex-col flex-1 mx-auto">
        {children}
      </div>
    </div>
  )
}

export default PosterBackdrop
