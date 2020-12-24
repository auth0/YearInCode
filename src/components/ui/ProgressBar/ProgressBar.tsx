import clsx from 'clsx'

import s from './ProgressBar.module.css'

interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({value, max, className}) => {
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={clsx('relative pt-1 w-full', className)}
    >
      <div className={s.progressBar}>
        <div
          style={{width: `${(value / max) * 100}%`}}
          className={s.progressBarValue}
        ></div>
      </div>
    </div>
  )
}

export default ProgressBar
