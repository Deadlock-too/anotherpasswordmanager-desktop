import TitleBar from './components/titlebar'
import Main from './scenes/main'
import Intro from './scenes/intro'
import { useEventInitializer } from './hooks/eventInitializer'

const App = () => {
  const { isInitialized, onNew } = useEventInitializer()

  return (
    <>
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
    </>
  )
}

export default App