import { useContext, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { FileContentContext, ModalContext, ThemeContext } from './contexts'
import PasswordDialog from './components/modal/password'

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const { isInitialized, initialize } = useContext(FileContentContext)
  const { setIsPasswordModalOpen } = useContext(ModalContext)
  const { setIsDark } = useContext(ThemeContext)

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)
    setIsDark(window.theming.darkMode.isDark())

    const fileOpenedHandler = (path, content) => initialize(path, content)
    window.electron.subscribeToFileOpened(fileOpenedHandler)

    const passwordInputHandler = () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.getElementById('openPasswordModal').showModal()
      setIsPasswordModalOpen(true)
    }
    window.electron.subscribeToPasswordInput(passwordInputHandler)

    return () => {
      window.electron.unsubscribeToFileOpened()
      window.electron.unsubscribeToPasswordInput()
    }
  }, [])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n }>
      <PasswordDialog variant={'open'} />
      <PasswordDialog variant={'create'} />
      <PasswordDialog variant={'update'} />
      <TitleBar/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ () => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              document.getElementById('createPasswordModal').showModal()
            } }/> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}
export default App

//TODO: MANAGE FAILED OPEN ATTEMPTS
//TODO: HIDE PASSWORD IN INPUT
//TODO: ADD PASSWORD STRENGTH METER
//TODO: ADD PASSWORD GENERATOR
//TODO: ADD PASSWORD GENERATOR SETTINGS