import { Theme } from '../../../../types'

export enum WindowVariant {
  Settings = 'settings',
  PasswordOpen = 'passwordOpen',
  FailedOpen = 'failedOpen',
  PasswordCreate = 'passwordCreate',
  PasswordUpdate = 'passwordUpdate',
  AddFolder = 'addFolder',
  FolderDeletionModal = 'folderDeletionModal',
  EntryDeletionModal = 'entryDeletionModal'
}


export const openSecondaryWindow = async (secondaryWindowEntry: string, variant: WindowVariant, currentTheme: Theme) => {
  const win = window.open(secondaryWindowEntry, variant)
  if (win) {
    win.name = variant
    win.document.querySelector('html')?.setAttribute('data-theme', currentTheme)
  }
}