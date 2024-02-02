import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import SettingsWindow from './scenes/settings'
import AddFolderWindow from './scenes/addFolder'
import { WindowVariant } from '../main/utils/windowManager'

const rootDiv = document.getElementById('secondary_root')
if (!rootDiv)
  throw new Error('Root div not found')

let initialized = false
window.theming.startupThemeAsync.then(theme => {
  if (initialized)
    return
  document.querySelector('html')?.setAttribute('data-theme', theme)
  initialized = true
})

const variant = window.name

let component
switch (variant) {
  case WindowVariant.Settings:
    component = <SettingsWindow/>
    break
  case WindowVariant.AddFolder:
    component = <AddFolderWindow/>
    break
  default:
    component = <div>Unknown variant</div>
}

const root = createRoot(rootDiv)
root.render(
  <I18nextProvider i18n={ i18n.default }>
    { component }
  </I18nextProvider>
)