import { createRoot } from 'react-dom/client'
import App from './app'
import { ContextProvider } from './contexts/contextProvider'

const rootDiv = document.getElementById('root')
if (!rootDiv)
  throw new Error('Root div not found')

const root = createRoot(rootDiv)
root.render(
  <ContextProvider>
    <App/>
  </ContextProvider>
)