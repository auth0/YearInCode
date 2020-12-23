import * as React from 'react'

type Refs<T> = Array<
  React.MutableRefObject<T | null> | ((instance: T | null) => void)
>

export default function useCombinedRefs<T extends HTMLElement>(
  ...refs: Refs<T>
) {
  const targetRef = React.useRef<T>()

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
