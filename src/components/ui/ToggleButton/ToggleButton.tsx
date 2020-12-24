import React from 'react'
import clsx from 'clsx'
import {useToggleState} from '@react-stately/toggle'
import {useToggleButton} from '@react-aria/button'
import {AriaButtonProps} from '@react-types/button'

import ButtonBase, {ButtonBaseProps} from '../ButtonBase'

const ToggleButton: React.FC<ButtonBaseProps> = props => {
  const {color = 'primary', children, className} = props
  const ref = React.useRef()
  const state = useToggleState(props)
  const {buttonProps} = useToggleButton(props, state, ref)

  return (
    <ButtonBase
      {...(buttonProps as AriaButtonProps<'button'>)}
      {...props}
      color={color}
      variant="outlined"
      ref={ref}
      className={clsx(
        {
          'bg-opacity-20 bg-flamingo-500 text-flamingo-500 border-flamingo-500':
            state.isSelected && color === 'primary',
        },
        className,
      )}
    >
      {children}
    </ButtonBase>
  )
}

export default ToggleButton
