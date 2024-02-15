import { createContext, useState } from 'react'

interface ModalContextState {
  secondaryWindowEntry: string | undefined
  setSecondaryWindowEntry: (entry: string | undefined) => void,
  isSecondaryWindowOpen: boolean
  setIsSecondaryWindowOpen: (isOpen: boolean) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ secondaryWindowEntry, setSecondaryWindowEntry ] = useState<string | undefined>()
  const [ isSecondaryWindowOpen, setIsSecondaryWindowOpen ] = useState(false)

  const context: ModalContextState = {
    secondaryWindowEntry,
    setSecondaryWindowEntry,
    isSecondaryWindowOpen,
    setIsSecondaryWindowOpen
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}