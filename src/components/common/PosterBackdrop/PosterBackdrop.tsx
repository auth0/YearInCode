import Image from 'next/image'

import s from './PosterBackdrop.module.css'

const PosterBackdrop: React.FC = ({children}) => {
  return (
    <main className={s.imageContainer}>
      <Image aria-hidden width={700} height={700} src="/img/poster.png" />
      <div className="container z-10 flex flex-1 flex-col mx-auto">
        {children}
      </div>
    </main>
  )
}

export default PosterBackdrop
