import * as React from 'react'
import {useOverlay, useModal, DismissButton} from '@react-aria/overlays'
import {useDialog} from '@react-aria/dialog'
import {FocusScope} from '@react-aria/focus'
import {mergeProps} from '@react-aria/utils'

interface PopoverProps {
  title?: string
  isOpen?: boolean
  onClose?: () => void
  className?: string
  children?: React.ReactNode
  style?: React.CSSProperties
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {title, children, isOpen, onClose, className, style, ...otherProps},
    ref,
  ) => {
    const {overlayProps} = useOverlay(
      {
        onClose,
        isOpen,
        isDismissable: true,
      },
      ref as any,
    )

    const {modalProps} = useModal()
    const {dialogProps, titleProps} = useDialog({}, ref as any)

    return (
      <FocusScope restoreFocus>
        <div
          {...mergeProps(overlayProps, dialogProps, otherProps, modalProps)}
          ref={ref}
          style={{...style, maxHeight: '100%'}}
          className={className}
        >
          <h3 {...titleProps} style={{marginTop: 0}}>
            {title}
          </h3>
          {children}
          <DismissButton onDismiss={onClose} />
        </div>
      </FocusScope>
    )
  },
)

export default Popover
