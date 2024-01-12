import React, { createContext, useCallback, useEffect, useState } from 'react'
import { Entry, File, Folder, uuid, UUID } from '../../types'
import { encrypt } from '../../../main/utils/crypt'
import { bool } from 'yup'

interface FileContentContextState {
  password: string | null
  setPassword: (password: string | null) => void
  isInitialized: boolean
  setIsInitialized: (isInitialized: boolean) => void
  initialize: (path: string, fileContent: string) => void
  filePath: string
  setFilePath: (path: string) => void
  fileContent: File | null
  reset: () => void
  folders: Folder[]
  entries: Entry[]
  setFolders: (folders: Folder[]) => void
  setEntries: (entries: Entry[]) => void
  handleAddEntry: (entry: Entry, folderId: UUID) => void
  handleAddFolder: (folder: Folder) => void
  handleUpdateEntry: (entry: Entry) => void
  handleDeleteEntry: (id: UUID) => void
  handleDeleteFolder: (id: UUID) => void
  resetSelection: () => void
  selectedEntryId: UUID | null
  selectedFolderId: UUID | null
  handleSelectEntry: (entry: Entry | null, newEntry: boolean) => void
  handleSelectFolder: (folder: Folder | null, currentlySelectedEntryId: UUID | null, currentlySelectedFolderId: UUID | null) => void
  updateFileContent: () => void
  hoveringFolderId: UUID | null
  hoveringEntryId: UUID | null
  setHoveringFolderId: (id: UUID | null) => void
  setHoveringEntryId: (id: UUID | null) => void
  deletingFolder: Folder | null
  deletingEntry: Entry | null
  setDeletingFolder: (id: Folder | null) => void
  setDeletingEntry: (id: Entry | null) => void
  refreshDetail: boolean
  toggleRefreshDetail: () => void
}

export const FileContentContext = createContext<FileContentContextState>({} as FileContentContextState)

export function FileContentContextProvider({ children }) {
  const [ password, setPassword ] = React.useState<string | null>(null)
  const [ isInitialized, setIsInitialized ] = React.useState<boolean>(false)
  const [ folders, setFolders ] = React.useState<Folder[]>([])
  const [ entries, setEntries ] = React.useState<Entry[]>([])
  const [ filePath, setFilePath ] = React.useState<string>('')
  const [ fileContent, setFileContent ] = React.useState<File | null>(null)
  const [ internalUpdateFileContentToggle, setInternalUpdateFileContentToggle ] = React.useState(false)

  const updateFileContent = () => setInternalUpdateFileContentToggle((prevState) => !prevState)

  const initialize = useCallback((path: string, fileContent: string) => {
    const fc: File = JSON.parse(fileContent)
    setFolders(fc.Folders)
    setIsInitialized(true)
    setFilePath(path)
  }, [])

  useEffect(() => {
    console.log(password)
  }, [ password ])

  useEffect(() => {
    const fc = {
      AppVersion: '0.0.1', //TODO READ FROM PACKAGE.JSON
      Folders: folders
    }
    setFileContent(fc)
    if (isInitialized && filePath) {
      const content = JSON.stringify(fc)
      if (password) {
        window.electron.saveFile(filePath, encrypt(content, password))
      } else {
        window.electron.saveFile(filePath, content)
      }
    }
  }, [internalUpdateFileContentToggle, filePath, password])

  const reset = useCallback(() => {
    setFolders([])
    setEntries([])
  }, [])

  const handleUpdateEntry = useCallback((entry: Entry) => {
    setEntries((prevState) => {
      const newState = [ ...prevState ]
      const index = newState.findIndex((e) => e.Id === entry.Id)
      newState[index] = entry
      return newState
    })
    setFolders((prevState) => {
      const newState = [ ...prevState ]
      const folderIndex = newState.findIndex((folder) => folder.Entries.findIndex((e) => e.Id === entry.Id) !== -1)
      const entryIndex = newState[folderIndex].Entries.findIndex((e) => e.Id === entry.Id)
      newState[folderIndex].Entries[entryIndex] = entry
      return newState
    })
    updateFileContent()
  }, [])

  const handleDeleteFolder = useCallback((id: UUID) => {
    setFolders((prevState) => {
      const index = prevState.findIndex((folder) => folder.Id === id)
      return prevState.filter((_, i) => i !== index)
    })
    updateFileContent()
  }, [])

  const handleDeleteEntry = useCallback((id: UUID) => {
    setEntries((prevState) => [ ...prevState.filter((entry) => entry.Id !== id) ])
    setFolders((prevState) => {
      const newState = [ ...prevState ]
      const folderIndex = newState.findIndex((folder) => folder.Entries.findIndex((entry) => entry.Id === id) !== -1)
      newState[folderIndex].Entries = newState[folderIndex].Entries.filter((entry) => entry.Id !== id)
      return newState
    })
    handleSelectEntryInternal(prevState => {
      if (prevState === id) {
        return null
      }
      return prevState
    })
    updateFileContent()
  }, [])

  //TODO: Manage folder rename
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
    updateFileContent()
  }, [])

  const handleAddFolder = useCallback((folder: Folder) => {
    setFolders(prevState => [ ...prevState, folder ])
    updateFileContent()
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

  const [ hoveringFolderId, setHoveringFolderId ] = useState<UUID | null>(null)
  const [ hoveringEntryId, setHoveringEntryId ] = useState<UUID | null>(null)
  const [ deletingFolder, setDeletingFolder ] = useState<Folder | null>(null)
  const [ deletingEntry, setDeletingEntry ] = useState<Entry | null>(null)
  const [ refreshDetail, setRefreshDetail ] = useState<boolean>(false)

  const toggleRefreshDetail = () => setRefreshDetail((prevState) => !prevState)

  const context: FileContentContextState = {
    password,
    setPassword,
    isInitialized,
    setIsInitialized,
    initialize,
    filePath,
    setFilePath,
    fileContent,
    reset,
    folders,
    entries,
    setFolders,
    setEntries,
    handleAddEntry,
    handleAddFolder,
    handleUpdateEntry,
    handleDeleteEntry,
    handleDeleteFolder,
    resetSelection,
    selectedEntryId,
    selectedFolderId,
    handleSelectEntry,
    handleSelectFolder,
    updateFileContent,
    hoveringFolderId,
    hoveringEntryId,
    setHoveringFolderId,
    setHoveringEntryId,
    deletingFolder,
    deletingEntry,
    setDeletingFolder,
    setDeletingEntry,
    refreshDetail,
    toggleRefreshDetail
  }

  return (
    <FileContentContext.Provider value={ context }>
      { children }
    </FileContentContext.Provider>
  )
}