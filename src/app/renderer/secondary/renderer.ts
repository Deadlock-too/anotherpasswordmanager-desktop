import './index'
import '../main/styles.css'
import { Config, Language, Theme } from '../../../types'


declare global {
  interface Window {
    app: {
      lock: () => void
      file: {
        openDialog: () => Promise<void>
        saveDialog: () => Promise<string | undefined>
        save: (path: string, data: string) => Promise<void>
        open: (path: string, password: string) => Promise<void>
      }
      config: {
        get: () => Promise<Config>
        set: (config: Config) => Promise<void>
        apply: (configIdentifier: string, value: any) => Promise<void>
        refresh: () => Promise<void>
      }
      theming: {
        startupThemeSync: Theme
        startupThemeAsync: Promise<Theme>
        isDark: () => Promise<boolean>
        isSystem: () => Promise<boolean>
        setTheme: (theme: string, setSystem: boolean) => Promise<boolean>
        setSystem: () => Promise<void>
      }
      localization: {
        getInitialI18nStore: () => Promise<any>
        changeLanguage: (lang: string) => Promise<void>
        startupLanguage: Promise<Language>
      }
    }
    electron: {
      log: (...args) => Promise<void>
      events: {
        subscribe: (event: string, callback: unknown) => void
        unsubscribe: (event: string) => void
        subscribeToResult: (eventName: string, callback: unknown) => void
        unsubscribeFromResult: (eventName: string) => void
        propagate(eventName: string, ...args: any[]): Promise<void>
        propagateResult<T>(eventName: string, result: T): Promise<void>
      }
    }
    versions: {
      node: () => string,
      chrome: () => string,
      electron: () => string
    }
    system: {
      platform: () => NodeJS.Platform
      clipboard: {
        read: () => Promise<string>,
        write: (text: string) => Promise<void>
        clear: () => Promise<void>
      }
    }
  }
}