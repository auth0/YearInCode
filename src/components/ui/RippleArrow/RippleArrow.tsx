import clsx from 'clsx'

import ArrowDown from '@assets/svg/arrow-down.svg'
import Circle from '@assets/svg/circle.svg'

import s from './RippleArrow.module.css'

interface Props {
  className?: string
  button?: boolean
  href?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  icon?: JSX.Element
  disabled?: boolean
}

const RippleArrow: React.FC<Props> = ({
  className,
  button,
  icon,
  href,
  ...rest
}) => {
  const Component = href
    ? ('a' as React.ElementType)
    : ('button' as React.ElementType)

  const Icon = icon ? icon : <ArrowDown />

  return (
    <Component
      className={clsx('relative flex items-center justify-center', className)}
      href={href}
      {...rest}
    >
      <span className="z-10 cursor-pointer">{Icon}</span>
      <Circles />
    </Component>
  )
}

const Circles = () => {
  return (
    <>
      {new Array(4).fill(null).map((_, i) => (
        <Circle
          key={i}
          className={clsx('absolute', s.ripple, s[`ripple--${i + 1}`])}
        />
      ))}
    </>
  )
}

export default RippleArrow
