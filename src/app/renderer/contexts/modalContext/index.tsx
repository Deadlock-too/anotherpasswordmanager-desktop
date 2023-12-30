import React, { createContext } from 'react'

interface ModalContextState {
  isAddFolderModalOpen: boolean
  setIsAddFolderModalOpen: (isOpen: boolean) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ isAddFolderModalOpen, setIsAddFolderModalOpen ] = React.useState<boolean>(false)

  const context: ModalContextState = {
    isAddFolderModalOpen,
    setIsAddFolderModalOpen
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}