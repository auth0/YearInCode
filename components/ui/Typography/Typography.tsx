import clsx from 'clsx'
import React from 'react'

export type Variants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'

const defaultVariantMapping: Record<Variants, React.ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
}

const getStyles = (variant: Variants) => {
  switch (variant) {
    case 'h1':
      return 'text-7xl'
    case 'h2':
      return 'text-6xl'
    case 'h3':
      return 'text-5xl'
    case 'h4':
      return 'text-4xl'
    case 'h5':
      return 'text-2xl'
    case 'h6':
      return 'text-xl'
    case 'body1':
      return 'text-base'
    case 'body2':
      return 'text-sm'
    case 'caption':
      return 'text-xs'
    default:
      return 'text-base'
  }
}

interface Props {
  variant: Variants

  as?: React.ElementType
  className?: string
  children?: React.ReactNode
}

const Typography = React.forwardRef<React.ElementType, Props>((props, ref) => {
  const {variant, as, className, ...other} = props

  const Component = as || defaultVariantMapping[variant]

  return (
    <Component
      ref={ref}
      className={clsx(getStyles(variant), className)}
      {...other}
    />
  )
})

export default Typography
