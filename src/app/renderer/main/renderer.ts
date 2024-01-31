import './index'
import './styles.css'
import { Config, Language, Theme } from '../../../types'

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
      startupThemeSync: Theme
      startupThemeAsync: Promise<Theme>
      isDark: () => Promise<boolean>
      isSystem: () => Promise<boolean>
      setTheme: (theme: string, setSystem: boolean) => Promise<boolean>
      setSystem: () => Promise<void>
    },
    dialog: {
      fileManagement: {
        open: () => Promise<string | undefined>,
        save: () => Promise<string | undefined>
      }
    },
    localization: {
      getInitialI18nStore: () => Promise<any>
      changeLanguage: (lang: string) => Promise<void>
      startupLanguage: Promise<Language>
    },
    clipboard: {
      read: () => Promise<string>,
      write: (text: string) => Promise<void>
    },
    electron: {
      subscribeToFileOpened: (callback: unknown) => void
      unsubscribeToFileOpened: () => void
      subscribeToFailedOpenFile: (callback: unknown) => void
      unsubscribeToFailedOpenFile: () => void
      subscribeToOpenFileFromPath: (callback: unknown) => void
      unsubscribeToOpenFileFromPath: () => void
      subscribeToUpdateTheme: (callback: unknown) => void
      unsubscribeToUpdateTheme: () => void
      subscribeToUpdateIsDark: (callback: unknown) => void
      unsubscribeToUpdateIsDark: () => void
      subscribeToChangeLanguage: (callback: unknown) => void
      unsubscribeToChangeLanguage: () => void
      subscribeToUpdateConfig: (callback: unknown) => void
      unsubscribeToUpdateConfig: () => void
      sendPasswordResult: (password: string) => void
      setFileContent: (path: string, password: string) => void
      saveFile: (path: string, data: string) => Promise<void>
      subscribeToSetSecondaryWindowEntry: (callback: unknown) => void
      unsubscribeToSetSecondaryWindowEntry: () => void
    },
    settings: {
      readConfig: () => Promise<Config>,
      writeConfig: (config: Config) => Promise<void>
    }
  }
}