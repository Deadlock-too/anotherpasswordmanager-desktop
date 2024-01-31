import './index'
import '../main/styles.css'
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
    localization: {
      getInitialI18nStore: () => Promise<any>
      changeLanguage: (lang: string) => Promise<void>
      startupLanguage: Promise<Language>
    },
    clipboard: {
      read: () => Promise<string>,
      write: (text: string) => Promise<void>
    },
    settings: {
      readConfig: () => Promise<Config>,
      writeConfig: (config: Config) => Promise<void>
    },
    config: {
      update: () => Promise<void>
    }
  }
}