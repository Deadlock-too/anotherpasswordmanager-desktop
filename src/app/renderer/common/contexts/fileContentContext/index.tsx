import { createContext, useCallback, useEffect, useState } from 'react'
import { Entry, File, Folder, uuid, UUID } from '../../../common/types'
import { encrypt } from '../../../../main/utils/crypt'
import pkg from '../../../../../../package.json'
import { useConfigContext } from '../index'

const CURRENT_APP_VERSION = pkg.version

interface FileContentContextState {
  password: string | null
  setPassword: (password: string | null) => void
  contentVersion: string | null
  setContentVersion: (version: string | null) => void
  isInitialized: boolean
  setIsInitialized: (isInitialized: boolean) => void
  initialize: (path: string, fileContent: string) => void
  filePath: string
  setFilePath: (path: string) => void
  fileName: string
  unsavedChanges: boolean
  fileContent: File | null
  reset: () => void
  folders: Folder[]
  entries: Entry[]
  setFolders: (folders: Folder[]) => void
  setEntries: (entries: Entry[]) => void
  handleAddEntry: (entry: Entry, folderId: UUID) => void
  handleAddFolder: (folder: Folder) => void
  handleUpdateEntry: (entry: Entry) => void
  handleUpdateFolder: (folder: Folder) => void
  handleDeleteEntry: (id: UUID) => void
  handleDeleteFolder: (id: UUID) => void
  resetSelection: () => void
  selectedEntryId: UUID | null
  selectedFolderId: UUID | null
  handleSelectEntry: (entry: Entry | null, newEntry: boolean) => void
  handleSelectFolder: (folder: Folder | null, currentlySelectedEntryId: UUID | null, currentlySelectedFolderId: UUID | null) => void
  updateFileContent: () => void
  forceUpdateFileContent: () => void
  hoveringFolderId: UUID | null
  hoveringEntryId: UUID | null
  setHoveringFolderId: (id: UUID | null) => void
  setHoveringEntryId: (id: UUID | null) => void
  deletingFolder: Folder | null
  deletingEntry: Entry | null
  setDeletingFolder: (id: Folder | null) => void
  setDeletingEntry: (id: Entry | null) => void
  editingFolderId: UUID | null
  editingEntryId: UUID | null
  setEditingFolderId: (id: UUID | null) => void
  setEditingEntryId: (id: UUID | null) => void
  refreshDetail: boolean
  toggleRefreshDetail: () => void
  isLocked: boolean
  setIsLocked: (isLocked: boolean) => void
}

export const FileContentContext = createContext<FileContentContextState>({} as FileContentContextState)

export function FileContentContextProvider({ children }) {
  const { config } = useConfigContext()

  const [ password, setPassword ] = useState<string | null>(null)
  const [ contentVersion, setContentVersion ] = useState<string | null>(null)
  const [ isInitialized, setIsInitialized ] = useState<boolean>(false)
  const [ folders, setFolders ] = useState<Folder[]>([])
  const [ entries, setEntries ] = useState<Entry[]>([])
  const [ filePath, setFilePath ] = useState<string>('')
  const [ fileName, setFileName ] = useState<string>('')
  const [ fileContent, setFileContent ] = useState<File | null>(null)
  const [ internalUpdateFileContentToggle, setInternalUpdateFileContentToggle ] = useState(false)
  const [ unsavedChanges, setUnsavedChanges ] = useState<boolean>(false)
  const [ isLocked, setIsLocked ] = useState<boolean>(false)

  const updateFileContent = () => {
    if (config.settings.general.autoSave) {
      setInternalUpdateFileContentToggle((prevState) => !prevState)
    } else {
      setUnsavedChanges(true)
    }
  }

  const forceUpdateFileContent = () => {
    handleUpdateFileContent()
  }

  const initialize = useCallback((path: string, fileContent: string) => {
    const fc: File = JSON.parse(fileContent)
    setFolders(fc.Folders)

    setContentVersion(fc.AppVersion) //TODO ID-11

    setIsInitialized(true)
    setFilePath(path)
    setFileName(path.split('\\').pop()?.split('/').pop() ?? '')
  }, [])

  const handleUpdateFileContent = () => {
    const fc = {
      AppVersion: CURRENT_APP_VERSION,
      Folders: folders
    }
    setFileContent(fc)
    if (isInitialized && filePath) {
      const content = JSON.stringify(fc)
      if (password) {
        window.app.file.save(filePath, encrypt(content, password))
      } else {
        window.app.file.save(filePath, content)
      }
      setUnsavedChanges(false)
    }
  }

  useEffect(() => {
    handleUpdateFileContent()
  }, [ internalUpdateFileContentToggle, filePath, password ])

  const reset = useCallback(() => {
    setFolders([])
    setEntries([])
    setFilePath('')
    setFileName('')
    setFileContent(null)
    setPassword(null)
    setContentVersion(null)
    setUnsavedChanges(false)
    setIsLocked(false)
    handleSelectEntryInternal(null)
    handleSelectFolderInternal(null)
    setIsInitialized(false)
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
  }, [config.settings.general.autoSave])

  const handleDeleteFolder = useCallback((id: UUID) => {
    setFolders((prevState) => {
      const index = prevState.findIndex((folder) => folder.Id === id)
      return prevState.filter((_, i) => i !== index)
    })
    updateFileContent()
  }, [config.settings.general.autoSave])

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
  }, [config.settings.general.autoSave])

  const handleUpdateFolder = useCallback((folder: Folder) => {
    setFolders((prevState) => {
      const folderIndex = prevState.findIndex((f) => f.Id === folder.Id)
      prevState[folderIndex] = folder
      return prevState
    })
    updateFileContent()
  }, [config.settings.general.autoSave])

  const handleAddEntry = useCallback((entry: Entry, folderId: UUID) => {
    setEntries(prevState => [ ...prevState, entry ])
    setFolders((prevState) => {
      const folderIndex = prevState.findIndex((folder) => folder.Id === folderId)
      prevState[folderIndex].Entries = [ ...prevState[folderIndex].Entries, entry ]
      return prevState
    })
    updateFileContent()
  }, [config.settings.general.autoSave])

  const handleAddFolder = useCallback((folder: Folder) => {
    setFolders(prevState => [ ...prevState, folder ])
    updateFileContent()
  }, [config.settings.general.autoSave])

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
  const [ editingFolderId, setEditingFolderId ] = useState<UUID | null>(null)
  const [ editingEntryId, setEditingEntryId ] = useState<UUID | null>(null)
  const [ refreshDetail, setRefreshDetail ] = useState<boolean>(false)

  const toggleRefreshDetail = () => setRefreshDetail((prevState) => !prevState)

  const context: FileContentContextState = {
    password,
    setPassword,
    contentVersion,
    setContentVersion,
    isInitialized,
    setIsInitialized,
    initialize,
    filePath,
    setFilePath,
    fileName,
    unsavedChanges,
    fileContent,
    reset,
    folders,
    entries,
    setFolders,
    setEntries,
    handleAddEntry,
    handleAddFolder,
    handleUpdateEntry,
    handleUpdateFolder,
    handleDeleteEntry,
    handleDeleteFolder,
    resetSelection,
    selectedEntryId,
    selectedFolderId,
    handleSelectEntry,
    handleSelectFolder,
    updateFileContent,
    forceUpdateFileContent,
    hoveringFolderId,
    hoveringEntryId,
    setHoveringFolderId,
    setHoveringEntryId,
    deletingFolder,
    deletingEntry,
    setDeletingFolder,
    setDeletingEntry,
    editingFolderId,
    editingEntryId,
    setEditingFolderId,
    setEditingEntryId,
    refreshDetail,
    toggleRefreshDetail,
    isLocked,
    setIsLocked
  }

  return (
    <FileContentContext.Provider value={ context }>
      { children }
    </FileContentContext.Provider>
  )
}