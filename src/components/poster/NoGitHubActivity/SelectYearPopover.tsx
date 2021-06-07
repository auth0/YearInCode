import * as React from 'react'
import {useMenuTriggerState} from '@react-stately/menu'
import {useOverlayPosition, OverlayContainer} from '@react-aria/overlays'
import {useButton} from '@react-aria/button'
import {useMenuTrigger} from '@react-aria/menu'
import clsx from 'clsx'

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
      <div className="flex flex-col items-center space-y-3">
        <label
          className={clsx('font-semibold', {
            'text-indigo-500': state.isOpen,
          })}
          htmlFor={menuTriggerProps.id}
        >
          Select year
        </label>
        <button
          className={clsx(
            'flex items-center justify-start px-3 py-2 space-x-1 text-2xl font-semibold bg-dark-slate-gray-500 border rounded-md border-gray-50',
            'transition-all duration-150 hover:border-indigo-200',
            {
              'border-indigo-500 hover:border-indigo-500': state.isOpen,
            },
          )}
          {...buttonProps}
          {...menuTriggerProps}
          ref={triggerRef}
        >
          <span>{year}</span>{' '}
          {state.isOpen ? (
            <ChevronUp width="18" height="18" strokeWidth="2" />
          ) : (
            <ChevronDown width="18" height="18" strokeWidth="2" />
          )}
        </button>
      </div>

      {state.isOpen && (
        <OverlayContainer>
          <Popover
            {...menuProps}
            {...positionProps}
            ref={overlayRef}
            isOpen={state.isOpen}
            onClose={state.close}
            className={clsx(
              'flex flex-col bg-dark-slate-gray-500 border rounded-md border-gray-50',
              {
                'border-indigo-500': state.isOpen,
              },
            )}
          >
            {otherPosters.map(({posterSlug, year}) => (
              <a
                className="px-6 py-3 font-semibold hover:bg-dark-slate-gray-800"
                href={`/posters/${posterSlug}`}
                key={posterSlug}
              >
                <Typography
                  onClick={() => state.close()}
                  variant="h5"
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
