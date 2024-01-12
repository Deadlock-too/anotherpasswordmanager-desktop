import React, { createContext } from 'react'

interface ModalContextState {
  isAddFolderModalOpen: boolean
  setIsAddFolderModalOpen: (isOpen: boolean) => void
  isPasswordModalOpen: boolean
  setIsPasswordModalOpen: (isOpen: boolean) => void
  isFailedOpenModalOpen: boolean
  setIsFailedOpenModalOpen: (isOpen: boolean) => void
  isDeletionModalOpen: boolean
  setIsDeletionModalOpen: (isOpen: boolean) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ isAddFolderModalOpen, setIsAddFolderModalOpen ] = React.useState<boolean>(false)
  const [ isPasswordModalOpen, setIsPasswordModalOpen ] = React.useState<boolean>(false)
  const [ isFailedOpenModalOpen, setIsFailedOpenModalOpen ] = React.useState<boolean>(false)
  const [ isDeletionModalOpen, setIsDeletionModalOpen ] = React.useState<boolean>(false)

  const context: ModalContextState = {
    isAddFolderModalOpen,
    setIsAddFolderModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isFailedOpenModalOpen,
    setIsFailedOpenModalOpen,
    isDeletionModalOpen,
    setIsDeletionModalOpen
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}