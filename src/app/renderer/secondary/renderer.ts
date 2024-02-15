import './index'
import '../main/styles.css'
import { Config, Language, Theme } from '../../../types'
import { Folder, RecordType, UUID } from '../common/types'


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
    lock: {
      subscribeToLock: (callback: unknown) => void
      unsubscribeToLock: () => void
      lock: () => void
    },
    config: {
      openAtStartup: (openAtStartup: boolean) => Promise<void>
      minimizeToTray: (minimizeToTray: boolean) => Promise<void>
      closeToTray: (closeToTray: boolean) => Promise<void>
      autoLockOnMinimize: (autoLockOnMinimize: boolean) => Promise<void>
      autoLockOnSleep: (autoLockOnSleep: boolean) => Promise<void>
      autoLockOnLock: (autoLockOnLock: boolean) => Promise<void>
      update: () => Promise<void>
    },
    dialogManagement: {
      addFolder: (folder: Folder) => Promise<void>
      getDeletingRecordInfo: (recordType: RecordType) => Promise<void>
      subscribeToGetDeletingRecordInfoResult: (callback: unknown) => void
      unsubscribeToGetDeletingRecordInfoResult: () => void
      deleteEntry: (id: UUID) => Promise<void>
      cancelDeleteEntry: () => Promise<void>
      deleteFolder: (id: UUID) => Promise<void>
      cancelDeleteFolder: () => Promise<void>
      setPassword: (password: string) => Promise<void>
      setFileContent: (password: string) => Promise<void>
      setInitialized: () => Promise<void>
      unlock: (password: string) => Promise<void>
      saveChanges: (saveChanges: boolean) => Promise<void>
    },
    log: {
      log: (...args) => Promise<void>
      info: (...args) => Promise<void>
      warn: (...args) => Promise<void>
      error: (...args) => Promise<void>
    }
  }
}