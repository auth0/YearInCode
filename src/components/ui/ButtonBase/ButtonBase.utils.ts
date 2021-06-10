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
          'hover:text-indigo-500 focus:border-indigo-500 hover:bg-indigo-500 hover:border-indigo-500':
            color === 'primary',
          'focus:border-dark-slate-gray-500 hover:bg-dark-slate-gray-500 hover:border-dark-slate-gray-500':
            color === 'default',
        },
        getButtonSize(size),
      )
    case 'contained':
      return clsx(
        {
          'bg-indigo-500 text-white hover:bg-indigo-600': color === 'primary',
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
