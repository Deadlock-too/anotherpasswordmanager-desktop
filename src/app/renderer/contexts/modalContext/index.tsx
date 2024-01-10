import React, { createContext } from 'react'

interface ModalContextState {
  isAddFolderModalOpen: boolean
  setIsAddFolderModalOpen: (isOpen: boolean) => void
  isPasswordModalOpen: boolean
  setIsPasswordModalOpen: (isOpen: boolean) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ isAddFolderModalOpen, setIsAddFolderModalOpen ] = React.useState<boolean>(false)
  const [ isPasswordModalOpen, setIsPasswordModalOpen ] = React.useState<boolean>(false)

  const context: ModalContextState = {
    isAddFolderModalOpen,
    setIsAddFolderModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}