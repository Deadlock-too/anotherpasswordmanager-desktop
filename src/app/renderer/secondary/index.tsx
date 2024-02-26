import { createRoot } from 'react-dom/client'
import SettingsWindow from './scenes/settings'
import AddFolderWindow from './scenes/addFolder'
import { WindowVariant } from '../main/utils/rendererWindowManager'
import DeletionWindow from './scenes/deletion'
import { RecordType } from '../common/types'
import FailureWindow from './scenes/failure'
import PasswordWindow from './scenes/password'
import UnsavedChangesWindow from './scenes/unsavedChanges'
import { ContextProvider } from '../common/contexts/contextProvider'

const rootDiv = document.getElementById('secondary_root')
if (!rootDiv)
  throw new Error('Root div not found')

let initialized = false
window.app.theming.startupThemeAsync.then(theme => {
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
  case WindowVariant.FolderDeletion:
    component = <DeletionWindow recordType={ RecordType.Folder }/>
    break
  case WindowVariant.EntryDeletion:
    component = <DeletionWindow recordType={ RecordType.Entry }/>
    break
  case WindowVariant.FailedOpen:
    component = <FailureWindow variant={ 'open' }/>
    break
  case WindowVariant.FailedUnlock:
    component = <FailureWindow variant={ 'unlock' }/>
    break
  case WindowVariant.PasswordCreate:
    component = <PasswordWindow variant={ 'create' }/>
    break
  case WindowVariant.PasswordOpen:
    component = <PasswordWindow variant={ 'open' }/>
    break
  case WindowVariant.PasswordUpdate:
    component = <PasswordWindow variant={ 'update' }/>
    break
  case WindowVariant.PasswordUnlock:
    component = <PasswordWindow variant={ 'unlock' }/>
    break
  case WindowVariant.UnsavedChanges:
    component = <UnsavedChangesWindow/>
    break
  default:
    component = <div>Unknown variant</div>
}

const root = createRoot(rootDiv)
root.render(
  <ContextProvider variant="secondary">
    { component }
  </ContextProvider>
)