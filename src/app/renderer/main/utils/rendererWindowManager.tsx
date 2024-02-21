import { Theme } from '../../../../types'
import { LOCALHOST_SECONDARY_WINDOW_ENTRY } from '../../../../consts'

let secondaryWindow: Window | null = null

export enum WindowVariant {
  Settings = 'settings',
  PasswordOpen = 'passwordOpen',
  PasswordUnlock = 'passwordUnlock',
  FailedOpen = 'failedOpen',
  FailedUnlock = 'failedUnlock',
  PasswordCreate = 'passwordCreate',
  PasswordUpdate = 'passwordUpdate',
  AddFolder = 'addFolder',
  FolderDeletion = 'folderDeletion',
  EntryDeletion = 'entryDeletion',
  UnsavedChanges = 'unsavedChanges'
}

export const openSecondaryWindow = async (variant: WindowVariant, beforeOpen: () => void, onClose: () => void, secondaryWindowEntry?: string) => {
  beforeOpen()
  secondaryWindow = window.open(secondaryWindowEntry ?? LOCALHOST_SECONDARY_WINDOW_ENTRY, variant, `{"width":${window.outerWidth},"height":${window.outerHeight},"x":${window.screenX},"y":${window.screenY}}`)
  if (secondaryWindow) {
    secondaryWindow.name = variant

    setInterval(() => {
      if (secondaryWindow && secondaryWindow.closed) {
        onClose()
      }
    }, 1000)
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