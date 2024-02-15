import { createRoot } from 'react-dom/client'
import App from './app'
import { ContextProvider } from '../common/contexts/contextProvider'

const rootDiv = document.getElementById('root')
if (!rootDiv)
  throw new Error('Root div not found')

let initialized = false

if (!initialized) {
  //Used sync to prevent cases when would get an error because of the async
  const theme = window.theming.startupThemeSync
  document.querySelector('html')?.setAttribute('data-theme', theme)
  initialized = true
}

const root = createRoot(rootDiv)
root.render(
  <ContextProvider variant="main">
    <App/>
  </ContextProvider>
)