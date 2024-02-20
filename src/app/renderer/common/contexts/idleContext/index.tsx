import { createContext, ReactNode, useEffect, useState } from 'react'
import { useConfigContext, useFileContentContext, useModalContext } from '../index'
import { throttle } from 'lodash'

const UserActivityEvents = [
  'load',
  'mousemove',
  'mousedown',
  'touchstart',
  'touchmove',
  'click',
  'keydown',
  'wheel'
]

interface IdleContextState {
  isIdle: boolean;
}

export const IdleContext = createContext<IdleContextState>({} as IdleContextState)

interface IIdleContextProviderProps {
  children: ReactNode;
  variant: 'main' | 'secondary';
}

export function IdleContextProvider(props : IIdleContextProviderProps) {
  const { isLocked, isInitialized } = useFileContentContext()
  const { isSecondaryWindowOpen } = useModalContext()
  const { config } = useConfigContext()

  const [ isIdle, setIsIdle ] = useState(false)

  const onTimeout = () => {
    setIsIdle(true)
  }

  let timer: NodeJS.Timeout | undefined = undefined
  const resetTimer = throttle(() => {
    if (timer) {
      clearTimeout(timer)
    }
    setIsIdle(false)
    timer = setTimeout(onTimeout, config.settings.security.autoLockTime * 1000)
  }, 500)

  const handleIdle = () => {
    let shouldSkip = false

    switch (props.variant) {
      case 'main': {
        shouldSkip = !config.settings.security.autoLock || !isInitialized || isLocked || isSecondaryWindowOpen
        break
      }
      case 'secondary': {
        shouldSkip = !config.settings.security.autoLock
        break
      }
    }

    if (shouldSkip) {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }

      clearEvents()

      return
    }

    clearEvents()

    UserActivityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })
  }

  const clearEvents = () => {
    UserActivityEvents.forEach((event) => {
      window.removeEventListener(event, resetTimer)
    })
  }

  useEffect(() => {
    handleIdle()

    return () => {
      clearEvents()
      clearTimeout(timer)
      timer = undefined
    }
  }, [isInitialized, isLocked, isSecondaryWindowOpen, config.settings.security.autoLock, config.settings.security.autoLockTime])

  useEffect(() => {
    if (config.settings.security.autoLock && isIdle) {
      window.app.lock()
    }
  }, [config.settings.security.autoLock, isIdle])

  const context : IdleContextState = {
    isIdle
  }

  return (
    <IdleContext.Provider value={ context }>
      { props.children }
    </IdleContext.Provider>
  )
}