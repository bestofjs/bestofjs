import React from 'react'

type Position = { x: number; y: number }
type FnProps = {
  isOpen: boolean
  open: (event: any, context: any) => void
  toggle: (event: any, context: any) => void
  close: (event: any, context: any) => void
}
type OpenFn = (event: any, context: any) => void
type Props = {
  content?: React.ReactNode | ((FnProps) => React.ReactNode)
  alignment: 'left' | 'right'
  position: 'bottom' | 'top' | 'cursor'
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
  children: (any) => React.ReactNode
}
type State = {
  isOpen: boolean
  overlayPosition?: Position
  context: any
}
export class Popover extends React.Component<Props, State> {
  static defaultProps = {
    alignment: 'left',
    position: 'bottom'
  }
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
      overlayPosition: undefined, // where to position the overlay when the Popover position is "cursor"
      context: undefined // data from the customer, to be passed to the context menu
    }
  }

  contentRef = React.createRef<HTMLDivElement>()

  componentWillUnmount() {
    this.removeEventListeners()
  }

  handleBodyClick = event => {
    if (this.isOutsideClick(event)) {
      event.stopPropagation()
      this.close() // close if the user has clicked outside the popover, ignoring clicks on the "content"
    }
  }

  isOutsideClick = event => {
    const contentNode = this.contentRef.current

    return !contentNode!.contains(event.target)
  }

  handleBodyKeyDown = event => {
    if (event.keyCode === 27) {
      event.stopPropagation()
      this.close() // Escape key
    }
  }

  open = (event, context) => {
    const overlayPosition = this.getOverlayPosition(event)
    this.setState({ isOpen: true, overlayPosition, context })
    this.addEventListeners()
  }

  close = () => {
    this.setState({ isOpen: false })
    this.removeEventListeners()
  }

  toggle = (event, context) => {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open(event, context)
    }
  }

  addEventListeners = () => {
    document.body.addEventListener('click', this.handleBodyClick)
    document.body.addEventListener('keydown', this.handleBodyKeyDown)
  }

  removeEventListeners = () => {
    document.body.removeEventListener('click', this.handleBodyClick)
    document.body.removeEventListener('keydown', this.handleBodyKeyDown)
  }

  getOverlayPosition = (event): Position => {
    const {
      offsetLeft: containerX,
      offsetTop: containerY
    } = event.currentTarget
    const { offsetX, offsetY } = event.nativeEvent

    return {
      x: containerX + offsetX,
      y: containerY + offsetY
    }
  }

  render() {
    const {
      content,
      alignment,
      position,
      style,
      contentStyle,
      children
    } = this.props
    const { isOpen, overlayPosition, context } = this.state

    let alignmentStyle
    if (isOpen) {
      alignmentStyle = {
        paddingTop: '4px',
        paddingBottom: '4px'
      }

      if (alignment === 'right') {
        alignmentStyle = {
          ...alignmentStyle,
          left: 'auto',
          right: 0
        }
      }

      if (position === 'top') {
        alignmentStyle = {
          ...alignmentStyle,
          bottom: '100%',
          top: 'auto'
        }
      }

      if (position === 'cursor') {
        alignmentStyle = {
          ...alignmentStyle,
          bottom: 'auto',
          left: overlayPosition!.x,
          top: overlayPosition?.y
        }
      }
    }

    return (
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: alignment === 'right' ? 'flex-end' : 'flex-start',
          ...style
        }}
      >
        {children({
          isOpen,
          open: this.open,
          toggle: this.toggle,
          close: this.close
        })}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              display: 'block',
              left: 0,
              minWidth: '15em',
              top: '100%',
              zIndex: 20000,
              ...alignmentStyle,
              ...contentStyle
            }}
          >
            <div
              ref={this.contentRef}
              style={{
                // ...s.border,
                // ...s.rounded,
                // borderColor: t.buttonBorderColor,
                // backgroundColor: t.buttonBackgroundColor,
                borderRadius: '4px',
                border: '1px solid #cccccc',
                backgroundColor: 'white',
                paddingBottom: '0.5rem',
                paddingTop: '0.5rem'
              }}
            >
              {typeof content === 'function'
                ? content({ close: this.close, ...context })
                : content}
            </div>
          </div>
        )}
      </div>
    )
  }
}
