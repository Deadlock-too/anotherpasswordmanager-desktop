import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import {
  useConfigContext,
  useFileContentContext,
  useModalContext,
  useThemeContext,
  useWindowContext
} from '../common/contexts'
import {
  getSecondaryWindow,
  openSecondaryWindow,
  updateSecondaryWindowTheme,
  WindowVariant
} from './utils/rendererWindowManager'
import { NamedIdentifiableType, RecordType } from '../common/types'
import IpcEventNames from '../../main/ipc/ipcEventNames'
import EventIdentifiers from '../../../consts/eventIdentifiers'

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const {
    isInitialized,
    initialize,
    setFilePath,
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
    setIsInitialized,
    setPassword,
    setIsLocked
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

  //TODO ID-7
  useEffect(() => {
    window.app.localization.getInitialI18nStore().then(setInitialI18nStore)

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)

    window.app.localization.startupLanguage.then(language => {
      i18n.changeLanguage(language)
    })

    const subscribedEvents : string[] = []

    const subscribeToEvent = (eventName: string, handler: (...args) => void) => {
      window.electron.events.subscribe(eventName, handler)
      subscribedEvents.push(eventName)
    }

    const fileOpenedHandler = (path, content) => initialize(path, content)
    subscribeToEvent(IpcEventNames.App.File.OpenSuccess, fileOpenedHandler)

    const fileOpenFailedHandler = async () => {
      await openSecondaryWindow(WindowVariant.FailedOpen, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
    }
    subscribeToEvent(IpcEventNames.App.File.OpenFailed, fileOpenFailedHandler)

    const openFileFromPathHandler = async (path) => {
      setFilePath(path)
      await openSecondaryWindow(WindowVariant.PasswordOpen, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
    }
    subscribeToEvent(IpcEventNames.App.File.OpenFromPath, openFileFromPathHandler)

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

    return () => {
      window.electron.events.unsubscribe(EventIdentifiers.SetFileContent)
    }
  }, [ filePath ])

  useEffect(() => {
    if (isInitialized) {
      const lockHandler = () => {
        setIsLocked(true)
      }
      window.electron.events.subscribe(IpcEventNames.App.Lock, lockHandler)
    }

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.Lock)
    }
  }, [isInitialized])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n.default }>
      <TitleBar variant="main" title="Another password manager"/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ async () => {
              await openSecondaryWindow(WindowVariant.PasswordCreate, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
            } }/> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}
export default App