import { createContext, useState } from 'react'

interface ModalContextState {
  isAddFolderModalOpen: boolean
  setIsAddFolderModalOpen: (isOpen: boolean) => void
  isPasswordModalOpen: boolean
  setIsPasswordModalOpen: (isOpen: boolean) => void
  isFailedOpenModalOpen: boolean
  setIsFailedOpenModalOpen: (isOpen: boolean) => void
  isDeletionModalOpen: boolean
  setIsDeletionModalOpen: (isOpen: boolean) => void
  isSettingsModalOpen: boolean
  setIsSettingsModalOpen: (isOpen: boolean) => void
  secondaryWindowEntry: string | null
  setSecondaryWindowEntry: (entry: string | null) => void
}

export const ModalContext = createContext<ModalContextState>({} as ModalContextState)

export function ModalContextProvider({ children }) {
  const [ secondaryWindowEntry, setSecondaryWindowEntry ] = useState<string | null>(null)
  const [ isAddFolderModalOpen, setIsAddFolderModalOpen ] = useState<boolean>(false)
  const [ isPasswordModalOpen, setIsPasswordModalOpen ] = useState<boolean>(false)
  const [ isFailedOpenModalOpen, setIsFailedOpenModalOpen ] = useState<boolean>(false)
  const [ isDeletionModalOpen, setIsDeletionModalOpen ] = useState<boolean>(false)
  const [ isSettingsModalOpen, setIsSettingsModalOpen ] = useState<boolean>(false)

  const context: ModalContextState = {
    isAddFolderModalOpen,
    setIsAddFolderModalOpen,
    isPasswordModalOpen,
    setIsPasswordModalOpen,
    isFailedOpenModalOpen,
    setIsFailedOpenModalOpen,
    isDeletionModalOpen,
    setIsDeletionModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    secondaryWindowEntry,
    setSecondaryWindowEntry,
  }

  return (
    <ModalContext.Provider value={ context }>
      { children }
    </ModalContext.Provider>
  )
}