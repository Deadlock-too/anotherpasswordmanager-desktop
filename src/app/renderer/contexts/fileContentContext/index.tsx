import React, { createContext, useCallback, useState } from 'react'
import { Entry, Folder, uuid, UUID } from '../../types'

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
  handleAddEntry: (entry: Entry, folderId: UUID) => void
  handleAddFolder: (folder: Folder) => void
  handleUpdateEntry: (entry: Entry) => void
  handleDeleteEntry: (id: UUID) => void
  resetSelection: () => void
  selectedEntryId: UUID | null
  selectedFolderId: UUID | null
  handleSelectEntry: (entry: Entry | null, newEntry: boolean) => void
  handleSelectFolder: (folder: Folder | null, currentlySelectedEntryId: UUID | null, currentlySelectedFolderId: UUID | null) => void
}

export const FileContentContext = createContext<FileContentContextState>({} as FileContentContextState)

export function FileContentContextProvider({ children }) {
  const [ isInitialized, setIsInitialized ] = React.useState<boolean>(false)
  const [ folders, setFolders ] = React.useState<Folder[]>([])
  const [ entries, setEntries ] = React.useState<Entry[]>([])

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

  const handleUpdateEntry = useCallback((entry: Entry) => {
    setEntries((prevState) => {
      const newState = [...prevState]
      const index = newState.findIndex((e) => e.Id === entry.Id)
      newState[index] = entry
      return newState
    })
    setFolders((prevState) => {
      const newState = [...prevState]
      const folderIndex = newState.findIndex((folder) => folder.Entries.findIndex((e) => e.Id === entry.Id) !== -1)
      const entryIndex = newState[folderIndex].Entries.findIndex((e) => e.Id === entry.Id)
      newState[folderIndex].Entries[entryIndex] = entry
      return newState
    })
  }, [])

  const handleDeleteEntry = useCallback((id: UUID) => {
    setEntries((prevState) => [...prevState.filter((entry) => entry.Id !== id)])
    setFolders((prevState) => {
      const newState = [...prevState]
      const folderIndex = newState.findIndex((folder) => folder.Entries.findIndex((entry) => entry.Id === id) !== -1)
      newState[folderIndex].Entries = newState[folderIndex].Entries.filter((entry) => entry.Id !== id)
      return newState
    })
  }, [])

  const handleUpdateFolder = useCallback((folder: Folder) => {
    const index = folders.findIndex((f) => f.Id === folder.Id)
    if (index !== -1) {
      setFolders((prevState) => {
        prevState[index] = folder
        return prevState
      })
    }
  }, [ folders ])

  const handleAddEntry = useCallback((entry: Entry, folderId: UUID) => {
    setEntries(prevState => [ ...prevState, entry ])
    setFolders((prevState) => {
      const folderIndex = prevState.findIndex((folder) => folder.Id === folderId)
      prevState[folderIndex].Entries = [ ...prevState[folderIndex].Entries, entry ]
      return prevState
    })
  }, [])

  const handleAddFolder = useCallback((folder: Folder) => {
    setFolders(prevState => [ ...prevState, folder ])
  }, [])

  const toggleIsInitialized = useCallback(() => {
    setIsInitialized(prevState => !prevState)
  }, [])

  const resetSelection = useCallback(() => {
    if (selectedEntryId) {
      handleSelectEntryInternal(null)
    } else {
      handleSelectFolderInternal(null)
    }
  }, [])

  const [ selectedFolderId, handleSelectFolderInternal ] = useState<UUID | null>(null)
  const [ selectedEntryId, handleSelectEntryInternal ] = useState<UUID | null>(null)

  const handleSelectEntry = useCallback((entry: Entry | null, newEntry: boolean) => {
    handleSelectEntryInternal(newEntry ? uuid() : (entry?.Id ?? null))
  }, [])

  const handleSelectFolder = useCallback((folder: Folder | null, currentSelectedEntryId: UUID | null, currentSelectedFolderId: UUID | null) => {
    if (currentSelectedFolderId !== folder?.Id) {
      handleSelectFolderInternal(folder ? folder.Id : null)
      if (folder) {
        setEntries(folder.Entries)
        if (!!currentSelectedEntryId && !(currentSelectedEntryId in folder.Entries.map((entry) => entry.Id))) {
          handleSelectEntryInternal(null)
        }
      }
    }
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
    handleAddFolder,
    handleUpdateEntry,
    handleDeleteEntry,
    resetSelection,
    selectedEntryId,
    selectedFolderId,
    handleSelectEntry,
    handleSelectFolder
  }

  return (
    <FileContentContext.Provider value={ context }>
      { children }
    </FileContentContext.Provider>
  )
}