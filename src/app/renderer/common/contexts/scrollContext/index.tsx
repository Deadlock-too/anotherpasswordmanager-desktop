import { createContext, useEffect, useState } from 'react'

interface ScrollContextState {
  isScrolling: boolean;
  setIsScrolling: (isScrolling: boolean) => void;
}

export const ScrollContext = createContext<ScrollContextState>({} as ScrollContextState)

export function ScrollContextProvider({ children }) {
  const [ isScrolling, setIsScrolling ] = useState(false)

  const context : ScrollContextState = {
    isScrolling,
    setIsScrolling
  }

  useEffect(() => {
    console.log('scrolling', isScrolling)
  }, [isScrolling])

  return (
    <ScrollContext.Provider value={ context }>
      { children }
    </ScrollContext.Provider>
  )
}