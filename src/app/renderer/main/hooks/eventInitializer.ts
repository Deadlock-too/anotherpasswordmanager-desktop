import {
  useConfigContext,
  useFileContentContext,
  useModalContext,
  useThemeContext,
  useWindowContext
} from '../../common/contexts'
import { useEffect } from 'react'
import i18n from '../../../../i18n'
import IpcEventNames from '../../../main/ipc/ipcEventNames'
import {
  getSecondaryWindow,
  openSecondaryWindow,
  updateSecondaryWindowTheme,
  WindowVariant
} from '../utils/rendererWindowManager'
import EventIdentifiers from '../../../../consts/eventIdentifiers'
import { NamedIdentifiableType, RecordType } from '../../common/types'

export const useEventInitializer = () => {
  const {
    isInitialized,
    initialize,
    handleFilePath,
    handleAddFolder,
    handleSelectFolder,
    selectedEntryId,
    selectedFolderId,
    handleDeleteEntry,
    handleDeleteFolder,
    setDeletingEntry,
    setDeletingFolder,
    deletingFolder,
    deletingEntry,
    filePath,
    fileName,
    setIsInitialized,
    setPassword,
    setIsLocked,
    unsavedChanges
  } = useFileContentContext()
  const { setSecondaryWindowEntry, secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()
  const { setIsDark } = useThemeContext()
  const { reloadConfig } = useConfigContext()
  const { setIsResizing, setIsScrolling } = useWindowContext()

  let resizeTimeout: NodeJS.Timeout | undefined = undefined
  let scrollTimeout: NodeJS.Timeout | undefined = undefined

  const onResize = () => {
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    setIsResizing(true)
    resizeTimeout = setTimeout(() => {
      setIsResizing(false)
      resizeTimeout = undefined
    }, 100)
  }

  const onScroll = () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
    setIsScrolling(true)
    scrollTimeout = setTimeout(() => {
      setIsScrolling(false)
      scrollTimeout = undefined
    }, 100)
  }

  useEffect(() => {
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)

    const subscribedEvents: string[] = []

    const subscribeToEvent = (eventName: string, handler: (...args) => void) => {
      window.electron.events.subscribe(eventName, handler)
      subscribedEvents.push(eventName)
    }

    const fileOpenedHandler = (path, content) => initialize(path, content)
    subscribeToEvent(IpcEventNames.App.File.OpenSuccess, fileOpenedHandler)

    const secondaryWindowEntryHandler = (entry) => {
      setSecondaryWindowEntry(entry)
    }
    subscribeToEvent(IpcEventNames.App.SetSecondaryWindowEntry, secondaryWindowEntryHandler)

    const updateThemeHandler = (theme) => {
      window.document.querySelector('html')?.setAttribute('data-theme', theme)
      const secondaryWindow = getSecondaryWindow()
      if (secondaryWindow)
        updateSecondaryWindowTheme(theme, secondaryWindow)
    }
    subscribeToEvent(IpcEventNames.App.Theming.UpdateTheme, updateThemeHandler)

    const updateIsDarkHandler = (isDark) => {
      setIsDark(isDark)
    }
    subscribeToEvent(IpcEventNames.App.Theming.UpdateIsDark, updateIsDarkHandler)

    const refreshConfigHandler = () => {
      reloadConfig()
    }
    subscribeToEvent(IpcEventNames.App.Config.Refresh, refreshConfigHandler)

    const setLanguageHandler = (language) => {
      i18n.changeLanguage(language)
    }
    subscribeToEvent(IpcEventNames.App.Localization.ChangeLanguage, setLanguageHandler)

    const addFolderHandler = (folder) => {
      handleAddFolder(folder)
      handleSelectFolder(folder, selectedEntryId, selectedFolderId)
    }
    subscribeToEvent(EventIdentifiers.AddFolder, addFolderHandler)

    const deleteEntryHandler = (entryId) => {
      handleDeleteEntry(entryId)
    }
    subscribeToEvent(EventIdentifiers.DeleteEntry, deleteEntryHandler)

    const cancelDeleteEntryHandler = () => {
      setDeletingEntry(null)
    }
    subscribeToEvent(EventIdentifiers.CancelDeleteEntry, cancelDeleteEntryHandler)

    const deleteFolderHandler = (folderId) => {
      handleDeleteFolder(folderId)
    }
    subscribeToEvent(EventIdentifiers.DeleteFolder, deleteFolderHandler)

    const cancelDeleteFolderHandler = () => {
      setDeletingFolder(null)
    }
    subscribeToEvent(EventIdentifiers.CancelDeleteFolder, cancelDeleteFolderHandler)

    const setPasswordHandler = (password) => {
      setPassword(password)
    }
    subscribeToEvent(EventIdentifiers.SetPassword, setPasswordHandler)

    const setIsInitializedHandler = () => {
      setIsInitialized(true)
    }
    subscribeToEvent(EventIdentifiers.SetInitialized, setIsInitializedHandler)

    return () => {
      subscribedEvents.forEach(eventName => window.electron.events.unsubscribe(eventName))
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    window.electron.events.subscribe(EventIdentifiers.GetDeletingRecordInfo, async (recordType: RecordType) => {
      switch (recordType) {
        case RecordType.Entry:
          if (deletingEntry) {
            await window.electron.events.propagateResult<NamedIdentifiableType>(EventIdentifiers.GetDeletingRecordInfo, deletingEntry)
          }
          break
        case RecordType.Folder:
          if (deletingFolder) {
            await window.electron.events.propagateResult<NamedIdentifiableType>(EventIdentifiers.GetDeletingRecordInfo, deletingFolder)
          }
          break
      }
    })

    return () => {
      window.electron.events.unsubscribe(EventIdentifiers.GetDeletingRecordInfo)
    }
  }, [ deletingEntry, deletingFolder ])

  useEffect(() => {
    const setFileContentHandler = (password) => {
      window.app.file.open(filePath, password)
    }
    window.electron.events.subscribe(EventIdentifiers.SetFileContent, setFileContentHandler)

    const getFileNameHandler = () => {
      window.electron.events.propagateResult(EventIdentifiers.GetFileName, fileName)
    }
    window.electron.events.subscribe(EventIdentifiers.GetFileName, getFileNameHandler)

    return () => {
      window.electron.events.unsubscribe(EventIdentifiers.SetFileContent)
      window.electron.events.unsubscribe(EventIdentifiers.GetFileName)
    }
  }, [ filePath ])

  useEffect(() => {
    const fileOpenFailedHandler = async () => {
      await openSecondaryWindow(WindowVariant.FailedOpen, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
    }
    window.electron.events.subscribe(IpcEventNames.App.File.OpenFailed, fileOpenFailedHandler)

    const openFileFromPathHandler = async (path) => {
      handleFilePath(path)
      await openSecondaryWindow(WindowVariant.PasswordOpen, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
    }
    window.electron.events.subscribe(IpcEventNames.App.File.OpenFromPath, openFileFromPathHandler)

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.File.OpenFailed)
      window.electron.events.unsubscribe(IpcEventNames.App.File.OpenFromPath)
    }
  }, [ secondaryWindowEntry ])


  useEffect(() => {
    if (isInitialized) {
      const lockHandler = () => {
        setIsLocked(true)
      }
      window.electron.events.subscribe(IpcEventNames.App.State.Lock, lockHandler)
    }

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.State.Lock)
    }
  }, [ isInitialized ])

  useEffect(() => {
    window.app.state.unsavedChanges(unsavedChanges).then(() => {
      if (unsavedChanges) {
        const unsavedChangesHandler = async () => {
          await openSecondaryWindow(WindowVariant.UnsavedChanges, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
        }
        window.electron.events.subscribe(IpcEventNames.App.State.Close, unsavedChangesHandler)

        return () => {
          window.electron.events.unsubscribe(IpcEventNames.App.State.Close)
        }
      }
    })
  }, [ unsavedChanges ])

  const onNew = async () => {
    await openSecondaryWindow(WindowVariant.PasswordCreate, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
  }

  return {
    isInitialized,
    onNew,
  }
}