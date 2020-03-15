/*
Adapted from:
https://github.com/streamich/react-use/blob/master/src/usePageLeave.ts
*/
import { useEffect, useRef, useState } from 'react'

export const usePageEvents = ({ onEnter, onLeave }, args = []) => {
  const isActive = useRef(true)

  useEffect(() => {
    const pageLeaveHandler = event => {
      event = event ? event : window.event
      const from = event.relatedTarget || event.toElement
      if (!from || from.nodeName === 'HTML') {
        isActive.current = false
        onLeave()
      }
    }

    const pageEnterHandler = event => {
      if (!isActive.current) {
        onEnter()
      }
    }

    document.addEventListener('mouseout', pageLeaveHandler)
    document.addEventListener('mouseenter', pageEnterHandler)
    return () => {
      document.removeEventListener('mouseout', pageLeaveHandler)
      document.removeEventListener('mouseenter', pageEnterHandler)
    }
  }, args) //eslint-disable-line react-hooks/exhaustive-deps
}

export const useIsAway = () => {
  const [isAway, setIsAway] = useState(false)

  usePageEvents({
    onEnter: () => {
      setIsAway(false)
    },
    onLeave: () => {
      setIsAway(true)
    }
  })

  return isAway
}
