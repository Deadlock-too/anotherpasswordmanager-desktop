import { createRoot } from 'react-dom/client'
import Settings from '../main/components/modal/settings'
import TitleBar from '../main/components/titlebar'

const rootDiv = document.getElementById('root2')
if (!rootDiv)
  throw new Error('Root div not found')

const root = createRoot(rootDiv)
root.render(
  <div>
    <TitleBar/>
    <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
      <Settings/>
    </div>
  </div>
)