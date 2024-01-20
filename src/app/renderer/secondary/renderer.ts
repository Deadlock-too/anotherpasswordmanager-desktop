import './index'
import '../main/styles.css'
import { Config } from '../../../types'

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
    localization: {
      getInitialI18nStore: () => Promise<any>,
      changeLanguage: (lang: string) => Promise<void>,
    },
    clipboard: {
      read: () => Promise<string>,
      write: (text: string) => Promise<void>
    },
    settings: {
      readConfig: () => Promise<Config>,
      writeConfig: (config: Config) => Promise<void>
    },
  }
}