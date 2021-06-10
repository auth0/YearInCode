import Clock from '@assets/svg/clock.svg'

import {AlertProps} from './Alert'

export function getBgColor(type: AlertProps['type']) {
  switch (type) {
    case 'warning':
      return 'bg-indigo-500 bg-opacity-10 border border-indigo-500 text-indigo-500'
    default:
      return ''
  }
}

export function getIcon(type: AlertProps['type']) {
  switch (type) {
    case 'warning':
      return <Clock aria-hidden />
    default:
      return ''
  }
}
