import { createContext, useState } from 'react'

interface WindowContextState {
  isScrolling: boolean;
  setIsScrolling: (isScrolling: boolean) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

export const WindowContext = createContext<WindowContextState>({} as WindowContextState)

export function WindowContextProvider({ children }) {
  const [ isScrolling, setIsScrolling ] = useState(false)
  const [ isResizing, setIsResizing ] = useState(false)

  const context : WindowContextState = {
    isScrolling,
    setIsScrolling,
    isResizing,
    setIsResizing
  }

  return (
    <WindowContext.Provider value={ context }>
      { children }
    </WindowContext.Provider>
  )
}