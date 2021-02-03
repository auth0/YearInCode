import React from 'react'
import clsx from 'clsx'

import {Logo} from '@components/ui'

import s from './Spinner.module.css'

interface SpinnerProps {
  size?: 'small' | 'default' | 'large'
}

const Spinner: React.FC<SpinnerProps> = ({size = 'default'}) => {
  const innerSize = {
    'w-5 h-5': size === 'small',
    'w-14 h-14': size === 'default',
    'w-16 h-16': size === 'large',
  }

  return (
    <div className={clsx('relative', innerSize)}>
      <span className={clsx(s.spinner, innerSize)} />
      {['default', 'large'].includes(size) && (
        <Logo size={size} color="light" className={s.logo} />
      )}
    </div>
  )
}

export default Spinner
