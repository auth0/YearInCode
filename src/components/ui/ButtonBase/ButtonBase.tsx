import React from 'react'
import clsx from 'clsx'
import {AriaButtonProps} from '@react-types/button'

import {getButtonStylesByVariant} from './ButtonBase.utils'

export interface ButtonBaseProps extends AriaButtonProps<'a' | 'button'> {
  color?: 'default' | 'primary'
  size?: 'default' | 'large'
  variant?: 'outlined' | 'contained'

  className?: string
  icon?: React.ReactNode
  href?: string
  style?: React.CSSProperties
  loading?: boolean
  disabled?: boolean
}

const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (props, ref) => {
    const {
      className,
      children,
      icon,
      color = 'default',
      size = 'default',
      variant = 'contained',
      href,
      loading,
      disabled,
      ...rest
    } = props

    const Component = href
      ? ('a' as React.ElementType)
      : ('button' as React.ElementType)

    const content = loading ? 'Loading...' : children

    return (
      <Component
        className={clsx(
          'flex items-center text-xs font-semibold tracking-widest rounded uppercase transition-colors duration-200 ease-out',
          'disabled:opacity-80 disabled:cursor-not-allowed',
          {
            'space-x-4': icon,
          },
          getButtonStylesByVariant(variant, color, size),
          className,
        )}
        ref={ref}
        href={href}
        disabled={loading || disabled}
        {...rest}
      >
        {icon ? (
          <>
            <span aria-hidden>{icon}</span> <span>{content}</span>
          </>
        ) : (
          content
        )}
      </Component>
    )
  },
)

export default ButtonBase
