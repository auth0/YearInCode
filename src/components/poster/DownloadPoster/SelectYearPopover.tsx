import * as React from 'react'
import {useMenuTriggerState} from '@react-stately/menu'
import {useOverlayPosition, OverlayContainer} from '@react-aria/overlays'
import {useButton} from '@react-aria/button'
import {useMenuTrigger} from '@react-aria/menu'

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
  const state = useMenuTriggerState({})

  const triggerRef = React.useRef(null)
  const overlayRef = React.useRef(null)
  const {menuTriggerProps, menuProps} = useMenuTrigger({}, state, triggerRef)

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
        className="inline-flex items-center justify-start space-x-1 font-semibold"
        {...buttonProps}
        {...menuTriggerProps}
        ref={triggerRef}
      >
        <span>{year}</span>{' '}
        {state.isOpen ? (
          <ChevronUp width="32" height="32" strokeWidth="3" />
        ) : (
          <ChevronDown width="32" height="32" strokeWidth="3" />
        )}
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...menuProps}
            {...positionProps}
            ref={overlayRef}
            isOpen={state.isOpen}
            onClose={state.close}
            className="flex flex-col bg-black border-2 rounded-md border-gray-50"
          >
            {otherPosters.map(({posterSlug, year}) => (
              <a
                className="px-5 py-4 font-semibold hover:bg-dark-slate-gray-800"
                href={`/posters/${posterSlug}`}
                key={posterSlug}
              >
                <Typography
                  onClick={() => state.close()}
                  variant="h4"
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
