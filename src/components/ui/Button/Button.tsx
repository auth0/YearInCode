import * as React from 'react'
import {useButton} from '@react-aria/button'
import {AriaButtonProps} from '@react-types/button'

import {useCombinedRef} from '@lib/hooks'

import ButtonBase, {ButtonBaseProps} from '../ButtonBase'

const Button = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(
  (props, userRef) => {
    const {onPress, ...otherProps} = props
    const libraryRef = React.useRef()
    const composedRef = useCombinedRef(libraryRef, userRef)
    const {buttonProps} = useButton(
      {
        ...props,
        elementType: props.href ? 'a' : 'button',
        isDisabled: props.loading || props.disabled,
      },
      composedRef,
    )

    return (
      <ButtonBase
        {...(buttonProps as AriaButtonProps<'a' | 'button'>)}
        {...otherProps}
        ref={composedRef}
      />
    )
  },
)

export default Button
