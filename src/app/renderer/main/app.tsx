import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { useConfigContext, useFileContentContext, useModalContext, useThemeContext } from '../common/contexts'
import PasswordModal from '../secondary/components/modal/password'
import AddFolderModal from '../secondary/components/modal/addFolder'
import FailedOpenModal from '../secondary/components/modal/failedOpen'
import { EntryDeletionModal, FolderDeletionModal } from '../secondary/components/modal/deletion'
import { getSecondaryWindow, updateSecondaryWindowTheme } from './utils/windowManager'

const Modals = () => {
  // PORT EVERYTHING TO SECONDARY WINDOW
  return (
    <>
      <PasswordModal variant={ 'open' }/>
      <PasswordModal variant={ 'create' }/>
      <PasswordModal variant={ 'update' }/>
      <AddFolderModal/>
      <FailedOpenModal/>
      <FolderDeletionModal/>
      <EntryDeletionModal/>
    </>
  )
}

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const { isInitialized, initialize, setFilePath } = useFileContentContext()
  const { setIsPasswordModalOpen, setIsFailedOpenModalOpen, setSecondaryWindowEntry } = useModalContext()
  const { setIsDark } = useThemeContext()
  const { reloadConfig } = useConfigContext()

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)

    window.localization.startupLanguage.then(language => {
      i18n.changeLanguage(language)
    })

    const fileOpenedHandler = (path, content) => initialize(path, content)
    window.electron.subscribeToFileOpened(fileOpenedHandler)

    const fileOpenFailedHandler = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementById('failedOpenModal').showModal()
      setIsFailedOpenModalOpen(true)
    }
    window.electron.subscribeToFailedOpenFile(fileOpenFailedHandler)

    const openFileFromPathHandler = (path) => {
      setFilePath(path)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementById('openPasswordModal').showModal()
      setIsPasswordModalOpen(true)
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

    return () => {
      window.electron.unsubscribeToFileOpened()
      window.electron.unsubscribeToFailedOpenFile()
      window.electron.unsubscribeToOpenFileFromPath()
      window.electron.unsubscribeToSetSecondaryWindowEntry()
      window.electron.unsubscribeToUpdateTheme()
      window.electron.unsubscribeToUpdateIsDark()
      window.electron.unsubscribeToChangeLanguage()
      window.electron.unsubscribeToUpdateConfig()
    }
  }, [])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n.default }>
      <Modals/>
      <TitleBar variant='main'/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              document.getElementById('createPasswordModal').showModal()
              setIsPasswordModalOpen(true)
            } }/> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}
export default App

//TODO: ADD PASSWORD STRENGTH METER
//TODO: ADD PASSWORD GENERATOR
//TODO: ADD PASSWORD GENERATOR SETTINGS

//TODO: [!!!] If file already open, ask if use wants to open another

//TODO: Check every 10 seconds if file has been changed
//TODO: If file has been changed, ask if user wants to reload it

//TODO: [!!!] CHECK CODE FOR USELESS RE-RENDERS