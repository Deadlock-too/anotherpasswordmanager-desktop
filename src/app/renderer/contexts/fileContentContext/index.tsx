import React, { createContext, useCallback } from 'react'
import { Entry, Folder, UUID } from '../../types'

interface FileContentContextState {
  isInitialized: boolean
  toggleIsInitialized: () => void
  reset: () => void
  folders: Folder[]
  entries: Entry[]
  setFolders: (folders: Folder[]) => void
  setEntries: (entries: Entry[]) => void
  handleRemoveEntry: (id: UUID) => void
  handleRemoveFolder: (id: UUID) => void
  handleAddEntry: (entry: Entry) => void
  handleAddFolder: (folder: Folder) => void
}

export const FileContentContext = createContext<FileContentContextState>({} as FileContentContextState)

export function FileContentContextProvider({ children }) {
  const [isInitialized, setIsInitialized] = React.useState<boolean>(true)
  const [folders, setFolders] = React.useState<Folder[]>([])
  const [entries, setEntries] = React.useState<Entry[]>([])
  const reset = useCallback(() => {
    setFolders([])
    setEntries([])
  }, [])
  const handleRemoveEntry = useCallback((id: UUID) => {
    const index = entries.findIndex((entry) => entry.Id === id)
    setEntries((prevState) => prevState.filter((_, i) => i !== index))
  }, [])
  const handleRemoveFolder = useCallback((id: UUID) => {
    const index = folders.findIndex((folder) => folder.Id === id)
    setFolders((prevState) => prevState.filter((_, i) => i !== index))
  }, [])
  const handleAddEntry = useCallback((entry: Entry) => {
    setEntries(prevState => [...prevState, entry])
  }, [])
  const handleAddFolder = useCallback((folder: Folder) => {
    setFolders(prevState => [...prevState, folder])
  }, [])
  const toggleIsInitialized = useCallback(() => {
    setIsInitialized(prevState => !prevState)
  }, [])

  const context: FileContentContextState = {
    isInitialized,
    toggleIsInitialized,
    reset,
    folders,
    entries,
    setFolders,
    setEntries,
    handleRemoveEntry,
    handleRemoveFolder,
    handleAddEntry,
    handleAddFolder
  }
  return (
    <FileContentContext.Provider value={context}>
      {children}
    </FileContentContext.Provider>
  )
}