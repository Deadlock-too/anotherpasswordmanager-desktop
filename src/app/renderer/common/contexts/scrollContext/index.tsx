import { createContext, useState } from 'react'

interface ScrollContextState {
  isLocallyScrolling: boolean;
  setIsLocallyScrolling: (isLocallyScrolling: boolean) => void;
  isLocallyResizing: boolean;
  setIsLocallyResizing: (isLocallyResizing: boolean) => void;
}

export const LocalContext = createContext<ScrollContextState>({} as ScrollContextState)

export function LocalContextProvider({ children }) {
  const [ isLocallyScrolling, setIsLocallyScrolling ] = useState(false)
  const [ isLocallyResizing, setIsLocallyResizing ] = useState(false)

  const context : ScrollContextState = {
    isLocallyScrolling,
    setIsLocallyScrolling,
    isLocallyResizing,
    setIsLocallyResizing
  }

  return (
    <LocalContext.Provider value={ context }>
      { children }
    </LocalContext.Provider>
  )
}