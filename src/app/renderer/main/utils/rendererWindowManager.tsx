import { Theme } from '../../../../types'

let secondaryWindow: Window | null = null

export enum WindowVariant {
  Settings = 'settings',
  PasswordOpen = 'passwordOpen',
  FailedOpen = 'failedOpen',
  PasswordCreate = 'passwordCreate',
  PasswordUpdate = 'passwordUpdate',
  AddFolder = 'addFolder',
  FolderDeletion = 'folderDeletion',
  EntryDeletion = 'entryDeletion'
}


export const openSecondaryWindow = async (variant: WindowVariant, secondaryWindowEntry?: string) => {
  secondaryWindow = window.open(secondaryWindowEntry ?? 'http://localhost:3000/secondary_window', variant, `{"width":${window.outerWidth},"height":${window.outerHeight},"x":${window.screenX},"y":${window.screenY}}`)
  if (secondaryWindow) {
    secondaryWindow.name = variant
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