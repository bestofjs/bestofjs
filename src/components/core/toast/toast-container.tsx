import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { createContainer } from 'unstated-next'

import './toast.css'

type Options = {
  render: (any) => React.ReactNode
  position: 'top-right' | 'top-left'
}
type StackItem = {
  id: number
  close: (value: any) => void
  options: Options
}
function useToastStack() {
  const [stack, setStack] = useState<StackItem[]>([])
  const idRef = useRef(0)

  function show(options) {
    return new Promise(resolve => {
      const toastId = idRef.current
      idRef.current++
      const close = value => {
        setStack(stack.filter(({ id }) => id === toastId))
        resolve(value)
      }
      setStack([...stack, { id: toastId, close, options }])
    })
  }

  return { show, stack }
}

export const ToastStackContainer = createContainer(useToastStack)

export function useToast() {
  return ToastStackContainer.useContainer()
}

export const ToastContainer = ({ children }) => {
  return (
    <ToastStackContainer.Provider>
      <ToastStackPortal />
      {children}
    </ToastStackContainer.Provider>
  )
}

const ToastStackPortal = () => {
  const toastRootElementId = 'toast-main-container'

  const renderStack = () => {
    const { stack } = ToastStackContainer.useContainer()
    return stack.map(({ id, close, options }) => {
      return (
        <div key={id} className={`toast-item toast-item-animation-bottom`}>
          {options.render(close)}
        </div>
      )
    })
  }

  return createPortal(
    <div className="toast-container top-right">{renderStack()}</div>,
    document.getElementById(toastRootElementId)!
  )
}
