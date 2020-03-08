import { useEffect, useState, useCallback, useRef } from 'react'

const defaultOptions = {
  cancelOnUnmount: true
}

/**
 * An async-utility hook that accepts a callback function and a delay time (in milliseconds), then repeats the
 * execution of the given function by the defined milliseconds.
 */
export const useInterval = (fn, milliseconds, options = defaultOptions) => {
  const opts = { ...defaultOptions, ...(options || {}) }
  const timeout = useRef()
  const callback = useRef(fn)
  const [isCleared, setIsCleared] = useState(false)

  // the clear method
  const clear = useCallback(() => {
    if (timeout.current) {
      clearInterval(timeout.current)
      setIsCleared(true)
    }
  }, [])

  // if the provided function changes, change its reference
  useEffect(
    () => {
      if (typeof fn === 'function') {
        callback.current = fn
      }
    },
    [fn]
  )

  // when the milliseconds change, reset the timeout
  useEffect(
    () => {
      if (typeof milliseconds === 'number' && milliseconds > 0) {
        timeout.current = setInterval(() => {
          callback.current()
        }, milliseconds)
      }
      if (milliseconds === 0) {
        clear()
      }
    },
    [milliseconds] // eslint-disable-line react-hooks/exhaustive-deps
  )

  // when component unmount clear the timeout
  useEffect(
    () => () => {
      if (opts.cancelOnUnmount) {
        clear()
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  return [isCleared, clear]
}
