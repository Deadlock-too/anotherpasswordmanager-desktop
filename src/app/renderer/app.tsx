import { useContext, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { FileContentContext } from './contexts'

const App = () => {
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)
  const { isInitialized, initialize, setIsInitialized } = useContext(FileContentContext)

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)
  }, [])

  useEffect(() => {
    const fileOpenedHandler = (path, content) => initialize(path, content)
    window.electron.subscribeToFileOpened(fileOpenedHandler)
    return () => window.electron.unsubscribeToFileOpened()
  }, [])

  if (!initialI18nStore)
    return null

  return (
    <I18nextProvider i18n={ i18n }>
      <TitleBar/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro onNewButtonClick={ () => setIsInitialized(true) }/> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}
export default App