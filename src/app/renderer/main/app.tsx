import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { useEventInitializer } from './hooks/eventInitializer'
import { Loading } from '../common/components'

const App = () => {
  const { initialI18nStore, isInitialized, onNew } = useEventInitializer()

  if (!initialI18nStore)
    return <Loading />

  return (
    <I18nextProvider i18n={ i18n.default }>
      <TitleBar variant="main" title="Another password manager"/>
      <div className="overflow-hidden">
        {
          (!isInitialized) ?
            <Intro
              onNewButtonClick={ onNew }
            /> :
            <Main/>
        }
      </div>
    </I18nextProvider>
  )
}

export default App