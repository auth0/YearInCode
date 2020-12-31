import clsx from 'clsx'

import {ButtonBaseProps} from './ButtonBase'

export function getButtonStylesByVariant(
  variant: ButtonBaseProps['variant'],
  color: ButtonBaseProps['color'],
  size: ButtonBaseProps['size'],
) {
  switch (variant) {
    case 'outlined':
      return clsx(
        'text-white border-white',
        'hover:bg-opacity-20',
        'focus:bg-opacity-20 border focus:outline-none',
        {
          'hover:text-flamingo-500 focus:border-flamingo-500 hover:bg-flamingo-500 hover:border-flamingo-500':
            color === 'primary',
          'focus:border-dark-slate-gray-500 hover:bg-dark-slate-gray-500 hover:border-dark-slate-gray-500':
            color === 'default',
        },
        getButtonSize(size),
      )
    case 'contained':
      return clsx(
        {
          'bg-flamingo-500 text-white hover:bg-flamingo-600':
            color === 'primary',
          'bg-dark-slate-gray-500 text-white hover:bg-dark-slate-gray-600':
            color === 'default',
        },
        getButtonSize(size),
      )
    default:
      return ''
  }
}

function getButtonSize(size: ButtonBaseProps['size']) {
  switch (size) {
    case 'large':
      return 'px-8 py-6'
    default:
      return 'px-6 py-4'
  }
}
