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
import { RecordType } from '../common/types'

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const { isInitialized, initialize, setFilePath, handleAddFolder, handleSelectFolder, selectedEntryId, selectedFolderId, handleDeleteEntry, handleDeleteFolder, setDeletingEntry, setDeletingFolder, deletingFolder, deletingEntry, filePath, setIsInitialized, setPassword } = useFileContentContext()
  const { setIsPasswordModalOpen, setSecondaryWindowEntry, secondaryWindowEntry } = useModalContext()
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
    window.localization.getInitialI18nStore().then(setInitialI18nStore)

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll)

    window.localization.startupLanguage.then(language => {
      i18n.changeLanguage(language)
    })

    const fileOpenedHandler = (path, content) => initialize(path, content)
    window.electron.subscribeToFileOpened(fileOpenedHandler)

    const fileOpenFailedHandler = async () => {
      await openSecondaryWindow(WindowVariant.FailedOpen, secondaryWindowEntry)
    }
    window.electron.subscribeToFailedOpenFile(fileOpenFailedHandler)

    const openFileFromPathHandler = async (path) => {
      setFilePath(path)
      await openSecondaryWindow(WindowVariant.PasswordOpen, secondaryWindowEntry)
    }
    window.electron.subscribeToOpenFileFromPath(openFileFromPathHandler)

    const secondaryWindowEntryHandler = (entry) => {
      setSecondaryWindowEntry(entry)
    }
    window.electron.subscribeToSetSecondaryWindowEntry(secondaryWindowEntryHandler)

    const updateThemeHandler = (theme) => {
      window.document.querySelector('html')?.setAttribute('data-theme', theme)
      const secondaryWindow = getSecondaryWindow()
      if (secondaryWindow)
        updateSecondaryWindowTheme(theme, secondaryWindow)
    }
    window.electron.subscribeToUpdateTheme(updateThemeHandler)

    const updateIsDarkHandler = (isDark) => {
      setIsDark(isDark)
    }
    window.electron.subscribeToUpdateIsDark(updateIsDarkHandler)

    const updateConfigHandler = () => {
      reloadConfig()
    }
    window.electron.subscribeToUpdateConfig(updateConfigHandler)

    const setLanguageHandler = (language) => {
      i18n.changeLanguage(language)
    }
    window.electron.subscribeToChangeLanguage(setLanguageHandler)

    const addFolderHandler = (folder) => {
      handleAddFolder(folder)
      handleSelectFolder(folder, selectedEntryId, selectedFolderId)
    }
    window.electron.subscribeToAddFolder(addFolderHandler)

    const deleteEntryHandler = (entryId) => {
      handleDeleteEntry(entryId)
    }
    window.electron.subscribeToDeleteEntry(deleteEntryHandler)

    const cancelDeleteEntryHandler = () => {
      setDeletingEntry(null)
    }
    window.electron.subscribeToCancelDeleteEntry(cancelDeleteEntryHandler)

    const deleteFolderHandler = (folderId) => {
      handleDeleteFolder(folderId)
    }
    window.electron.subscribeToDeleteFolder(deleteFolderHandler)

    const cancelDeleteFolderHandler = () => {
      setDeletingFolder(null)
    }
    window.electron.subscribeToCancelDeleteFolder(cancelDeleteFolderHandler)

    const setPasswordHandler = (password) => {
      setPassword(password)
    }
    window.electron.subscribeToSetPassword(setPasswordHandler)

    const setIsInitializedHandler = () => {
      setIsInitialized(true)
    }
    window.electron.subscribeToSetInitialized(setIsInitializedHandler)

    return () => {
      window.electron.unsubscribeToFileOpened()
      window.electron.unsubscribeToFailedOpenFile()
      window.electron.unsubscribeToOpenFileFromPath()
      window.electron.unsubscribeToSetSecondaryWindowEntry()
      window.electron.unsubscribeToUpdateTheme()
      window.electron.unsubscribeToUpdateIsDark()
      window.electron.unsubscribeToChangeLanguage()
      window.electron.unsubscribeToUpdateConfig()
      window.electron.unsubscribeToAddFolder()
      window.electron.unsubscribeToDeleteEntry()
      window.electron.unsubscribeToCancelDeleteEntry()
      window.electron.unsubscribeToDeleteFolder()
      window.electron.unsubscribeToCancelDeleteFolder()
      window.electron.unsubscribeToSetInitialized()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    window.electron.subscribeToGetDeletingRecordInfo((recordType: RecordType) => {
      switch (recordType) {
        case RecordType.Entry:
          if (deletingEntry)
            window.electron.sendGetDeletingRecordInfoResult(deletingEntry)
          break
        case RecordType.Folder:
          if (deletingFolder)
            window.electron.sendGetDeletingRecordInfoResult(deletingFolder)
          break
      }
    })

    return () => {
      window.electron.unsubscribeToGetDeletingRecordInfo()
    }
  }, [deletingEntry, deletingFolder])

  useEffect(() => {
    const setFileContentHandler = (password) => {
      window.electron.setFileContent(filePath, password)
    }
    window.electron.subscribeToSetFileContent(setFileContentHandler)

    return () => {
      window.electron.unsubscribeToSetFileContent()
    }
  }, [filePath])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n.default }>
      <TitleBar variant='main'/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ async () => {
              await openSecondaryWindow(WindowVariant.PasswordCreate, secondaryWindowEntry)
            } }/> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}
export default App