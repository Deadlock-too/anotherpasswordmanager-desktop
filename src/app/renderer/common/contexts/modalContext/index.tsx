import { createContext, useState } from 'react'

interface ModalContextState {
  secondaryWindowEntry: string | undefined
  setSecondaryWindowEntry: (entry: string | undefined) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ secondaryWindowEntry, setSecondaryWindowEntry ] = useState<string | undefined>()

  const context: ModalContextState = {
    secondaryWindowEntry,
    setSecondaryWindowEntry,
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}