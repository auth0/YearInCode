import * as React from 'react'
import {useOverlayTriggerState} from '@react-stately/overlays'
import {
  useOverlayTrigger,
  useOverlayPosition,
  OverlayContainer,
} from '@react-aria/overlays'
import {useButton} from '@react-aria/button'
import Link from 'next/link'

import ChevronUp from '@assets/svg/chevron-up.svg'
import ChevronDown from '@assets/svg/chevron-down.svg'
import {Popover, Typography} from '@components/ui'
import {PosterSlugResponse} from '@nebula/types/poster'
import {Year} from '@nebula/types/queue'

interface SelectYearPopover {
  year: Year
  otherPosters: PosterSlugResponse['otherPosters']
}

export default function SelectYearPopover({
  year,
  otherPosters,
}: SelectYearPopover) {
  const state = useOverlayTriggerState({})

  const triggerRef = React.useRef()
  const overlayRef = React.useRef()
  const {triggerProps, overlayProps} = useOverlayTrigger(
    {type: 'dialog'},
    state,
    triggerRef,
  )

  const {overlayProps: positionProps} = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: 'bottom',
    offset: 5,
    isOpen: state.isOpen,
  })

  const {buttonProps} = useButton(
    {
      onPress: () => state.toggle(),
    },
    triggerRef,
  )

  return (
    <>
      <button
        className="flex items-center self-center space-x-2 font-semibold"
        {...buttonProps}
        {...triggerProps}
        ref={triggerRef}
      >
        <span>{year}</span>{' '}
        {state.isOpen ? (
          <ChevronUp strokeWidth="3" />
        ) : (
          <ChevronDown strokeWidth="3" />
        )}
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...overlayProps}
            {...positionProps}
            ref={overlayRef}
            isOpen={state.isOpen}
            onClose={state.close}
            className="flex flex-col overflow-hidden rounded-md"
          >
            {otherPosters.map(({posterSlug, year}) => (
              <a
                className="px-5 py-4 font-semibold hover:bg-gray-400"
                href={`/posters/${posterSlug}`}
                key={posterSlug}
              >
                <Typography
                  onClick={() => state.close()}
                  variant="h1"
                  as="span"
                >
                  {year}
                </Typography>
              </a>
            ))}
          </Popover>
        </OverlayContainer>
      )}
    </>
  )
}
