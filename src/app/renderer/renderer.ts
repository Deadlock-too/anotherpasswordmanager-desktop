import './index'
import './styles.css'

declare global {
  interface Window {
    versions: {
      node: () => string,
      chrome: () => string,
      electron: () => string
    },
    system: {
      platform: () => NodeJS.Platform
    },
    theming: {
      darkMode: {
        isDark: () => boolean
        toggle: () => boolean
        system: () => void
      }
    },
    dialog: {
      fileManagement: {
        open: () => Promise<string | undefined>,
        save: () => Promise<string | undefined>
      }
    },
    localization: {
      getInitialI18nStore: () => Promise<any>,
      changeLanguage: (lang: string) => Promise<void>,
    },
    clipboard: {
      read: () => Promise<string>,
      write: (text: string) => Promise<void>
    },
    electron: {
      subscribeToFileOpened: (callback: unknown) => void
      unsubscribeToFileOpened: () => void
      subscribeToPasswordInput: (callback: unknown) => void
      unsubscribeToPasswordInput: () => void
      subscribeToFailedOpenFile: (callback: unknown) => void
      unsubscribeToFailedOpenFile: () => void
      sendPasswordResult: (password: string) => void
      saveFile: (path: string, data: string) => Promise<void>
    }
  }
}