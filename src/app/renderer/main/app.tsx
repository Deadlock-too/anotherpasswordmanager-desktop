import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { useFileContentContext, useModalContext, useThemeContext } from './contexts'
import PasswordModal from './components/modal/password'
import AddFolderModal from './components/modal/addFolder'
import FailedOpenModal from './components/modal/failedOpen'
import { EntryDeletionModal, FolderDeletionModal } from './components/modal/deletion'
import SettingsModal from './components/modal/settings'
import { openSecondaryWindow } from './utils/windowManager'

const Modals = () => {
  return (
    <>
      <PasswordModal variant={ 'open' }/>
      <PasswordModal variant={ 'create' }/>
      <PasswordModal variant={ 'update' }/>
      <AddFolderModal/>
      <FailedOpenModal/>
      <FolderDeletionModal/>
      <EntryDeletionModal/>
      <SettingsModal/>
    </>
  )
}

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const { isInitialized, initialize, setFilePath } = useFileContentContext()
  const { setIsPasswordModalOpen, setIsFailedOpenModalOpen } = useModalContext()
  const { setIsDark } = useThemeContext()

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)
    setIsDark(window.theming.darkMode.isDark())

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

    return () => {
      window.electron.unsubscribeToFileOpened()
      window.electron.unsubscribeToFailedOpenFile()
      window.electron.unsubscribeToOpenFileFromPath()
    }
  }, [])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n.default }>
      <Modals />
      <TitleBar/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ () => {
              openSecondaryWindow().then(r => console.log(r))

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

//TODO: If file already open, ask if use wants to open another