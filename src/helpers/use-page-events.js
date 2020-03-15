import { useEffect, useState } from 'react'

export const useIsDocumentVisible = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handler = () => {
      const isVisible = document.visibilityState === 'visible' // "hidden" or "visible"
      setIsVisible(isVisible)
    }
    document.addEventListener('visibilitychange', handler)
    return () => {
      document.removeEventListener('visibilitychange', handler)
    }
  })

  return isVisible
}
