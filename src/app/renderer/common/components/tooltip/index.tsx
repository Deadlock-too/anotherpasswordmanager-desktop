import {
  autoUpdate,
  flip, FloatingPortal,
  offset,
  Placement,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStyles
} from '@floating-ui/react'
import {
  cloneElement,
  createContext,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode, RefObject,
  useContext, useEffect,
  useMemo,
  useState
} from 'react'
import { useScrollContext } from '../../contexts'

interface TooltipOptions {
  initialOpen?: boolean
  placement?: Placement
  open?: boolean
  onOpenChange?: (open: boolean) => void
  parentScrollableDivRef?: RefObject<HTMLDivElement>
}

export const useTooltip = ({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen
}: TooltipOptions = {}) => {
  const [ uncontrolledOpen, setUncontrolledOpen ] = useState(initialOpen)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = setControlledOpen ?? setUncontrolledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      // offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5
      }),
      shift({ padding: 5 })
    ]
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    delay: 200,
    enabled: controlledOpen == null
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const transitions = useTransitionStyles(context, {
    duration: 250,
    initial: {
      opacity: 0,
      transform: 'scale(0)'
    },
    close: {
      opacity: 0,
      transform: 'scale(0)'
    }
  })

  const interactions = useInteractions([ hover, focus, dismiss, role ])

  return useMemo(() => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      transitionStyles: transitions.styles,
    }),
    [ open, setOpen, interactions, data, transitions.styles ]
  )
}

type ContextType = ReturnType<typeof useTooltip> | null

const TooltipContext = createContext<ContextType>(null)

export const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}

export const Tooltip = ({
  children,
  ...options
}: { children: ReactNode } & TooltipOptions) => {
  const tooltip = useTooltip(options)
  const { isScrolling } = useScrollContext()

  const closeTooltip = () => {
    tooltip.setOpen(false)
  }

  useEffect(() => {
    window.addEventListener('resize', closeTooltip)
    return () => {
      window.removeEventListener('resize', closeTooltip)
    }
  }, [])

  useEffect(() => {
    console.log('Scrolling inside tooltip', isScrolling)
    if (isScrolling)
      closeTooltip()
  }, [isScrolling])

  return (
    <TooltipContext.Provider value={ tooltip }>
      { children }
    </TooltipContext.Provider>
  )
}

export const TooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext()
  const childrenRef = (children as any).ref
  const ref = useMergeRefs([ context.refs.setReference, propRef, childrenRef ])

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        "data-state": context.open ? 'open' : 'closed'
      })
    )
  }

  return (
    <div
      tabIndex={ -1 }
      ref={ ref }
      data-state={ context.open ? 'open' : 'closed' }
      {...context.getReferenceProps(props)}
    >
      { children }
    </div>
  )
})

export const TooltipContent = forwardRef<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
>(function TooltipContent({style, ...props}, propRef) {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])
  const [shouldRender, setShouldRender] = useState(context.open)

  // This is needed to prevent the tooltip from being not rendered when it is closing, preventing the animation to be played
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    if (context.open) {
      setShouldRender(true)
    } else {
      timeoutId = setTimeout(() => {
        setShouldRender(false)
      }, 250)
    }
    return () => {
      clearTimeout(timeoutId)
    }
  }, [context.open])

  if (!shouldRender) return null

  return (
    <FloatingPortal>
      <div
        ref={ ref }
        style={{
          ...style,
          ...context.transitionStyles,
          ...context.floatingStyles,
          //Needed to prevent the tooltip animation to not be played when the tooltip is opened
          transform: `${ context.floatingStyles.transform } ${ context.transitionStyles.transform }`
        }}
        {...context.getFloatingProps(props)}
      />
    </FloatingPortal>
  )
})

export const useTimedTooltip = (time: number) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const [ tooltipTimeout, setTooltipTimeout ] = useState<NodeJS.Timeout | null>(null)

  const handleTooltipOpen = () => {
    setIsOpen(true)
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
    }
    setTooltipTimeout(setTimeout(() => {
      setIsOpen(false)
    }, time))
  }

  const handleTooltipClose = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout)
      setTooltipTimeout(null)
    }
    setIsOpen(false)
  }

  return { isOpen, handleTooltipOpen, handleTooltipClose }
}
