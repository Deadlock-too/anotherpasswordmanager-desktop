import { useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { useFileContentContext, useModalContext } from './contexts'
import PasswordModal from '../secondary/components/modal/password'
import AddFolderModal from '../secondary/components/modal/addFolder'
import FailedOpenModal from '../secondary/components/modal/failedOpen'
import { EntryDeletionModal, FolderDeletionModal } from '../secondary/components/modal/deletion'

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

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)

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

    return () => {
      window.electron.unsubscribeToFileOpened()
      window.electron.unsubscribeToFailedOpenFile()
      window.electron.unsubscribeToOpenFileFromPath()
      window.electron.unsubscribeToSetSecondaryWindowEntry()
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

//TODO: If file already open, ask if use wants to open another