import { Theme } from '../../../../types'

let secondaryWindow: Window | null = null

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
  secondaryWindow = window.open(secondaryWindowEntry, variant)
  if (secondaryWindow) {
    secondaryWindow.name = variant
    secondaryWindow.document.querySelector('html')?.setAttribute('data-theme', currentTheme)
  }
}

export const getSecondaryWindow = () => {
  return secondaryWindow
}

export const updateSecondaryWindowTheme = (theme: Theme, secondaryWindow: Window) => {
  if (secondaryWindow) {
    secondaryWindow.document.querySelector('html')?.setAttribute('data-theme', theme)
  }
}