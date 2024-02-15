import { contextBridge, ipcRenderer } from 'electron'
import IpcEventNames from './ipc/ipcEventNames'
import { Config, Theme } from '../../types'
import { Folder, RecordType, UUID } from '../renderer/common/types'

contextBridge.exposeInMainWorld('theming', {
  startupThemeSync: () => {
    let theme: Theme = Theme.system
    let isWaiting = true
    ipcRenderer.invoke(IpcEventNames.Theming.GetStartupTheme)
      .then((result) => {
        theme = result
      })
      .finally(() => {
        isWaiting = false
      })
    while (isWaiting) {
      /* do nothing */
    }
    return theme
  },
  startupThemeAsync: ipcRenderer.invoke(IpcEventNames.Theming.GetStartupTheme),
  isDark: () => ipcRenderer.invoke(IpcEventNames.Theming.IsDark),
  isSystem: () => ipcRenderer.invoke(IpcEventNames.Theming.IsSystem),
  setTheme: (theme: string, setSystem: boolean) => ipcRenderer.invoke(IpcEventNames.Theming.SetTheme, theme, setSystem),
  setSystem: () => ipcRenderer.invoke(IpcEventNames.Theming.SetSystem)
})

contextBridge.exposeInMainWorld('localization', {
  changeLanguage: (lang: string) => {
    return ipcRenderer.invoke(IpcEventNames.Localization.ChangeLanguage, lang)
  },
  startupLanguage: ipcRenderer.invoke(IpcEventNames.Localization.GetStartupLanguage)
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('system', {
  platform: () => process.platform,
})

contextBridge.exposeInMainWorld('clipboard', {
  read: (): Promise<string> => {
    return ipcRenderer.invoke(IpcEventNames.Clipboard.Read)
  },
  write: (text: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Clipboard.Write, text)
  }
})

contextBridge.exposeInMainWorld('electron', {
  subscribeToUpdateIsDark: (callback) => {
    ipcRenderer.on(IpcEventNames.Theming.UpdateIsDark, (event, ...args) => callback(...args))
  },
  unsubscribeToUpdateIsDark: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.Theming.UpdateIsDark)
  },
})

contextBridge.exposeInMainWorld('lock', {
  subscribeToLock: (callback) => {
    ipcRenderer.on(IpcEventNames.Electron.Lock, (event, ...args) => callback(...args))
  },
  unsubscribeToLock: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.Electron.Lock)
  },
})

contextBridge.exposeInMainWorld('settings', {
  readConfig: (): Promise<Config> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Get)
  },
  writeConfig: (config: Config): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Set, config)
  }
})

contextBridge.exposeInMainWorld('config', {
  update: (): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Update)
  },
  openAtStartup: (openAtStartup: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.OpenAtStartup, openAtStartup)
  },
  minimizeToTray: (minimizeToTray: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.MinimizeToTray, minimizeToTray)
  },
  closeToTray: (closeToTray: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.CloseToTray, closeToTray)
  },
  autoLockOnMinimize: (autoLockOnMinimize: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.AutoLockOnMinimize, autoLockOnMinimize)
  },
  autoLockOnSleep: (autoLockOnSleep: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.AutoLockOnSleep, autoLockOnSleep)
  },
  autoLockOnLock: (autoLockOnLock: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.AutoLockOnLock, autoLockOnLock)
  }
})

contextBridge.exposeInMainWorld('dialogManagement', {
  addFolder: (folder: Folder): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.AddFolder, folder)
  },
  getDeletingRecordInfo: (recordType: RecordType): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.GetDeletingRecordInfo, recordType)
  },
  subscribeToGetDeletingRecordInfoResult: (callback) => {
    ipcRenderer.on(IpcEventNames.DialogManagement.GetDeletingRecordInfoResult, (event, ...args) => callback(...args))
  },
  unsubscribeToGetDeletingRecordInfoResult: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.DialogManagement.GetDeletingRecordInfoResult)
  },
  deleteEntry: (id: UUID): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.DeleteEntry, id)
  },
  cancelDeleteEntry: () => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.CancelDeleteEntry)
  },
  deleteFolder: (id: UUID): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.DeleteFolder, id)
  },
  cancelDeleteFolder: () => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.CancelDeleteFolder)
  },
  setPassword: (password: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.SetPassword, password)
  },
  setFileContent: (password: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.SetFileContent, password)
  },
  setInitialized: (): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.SetInitialized)
  },
  unlock: (password: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.Unlock, password)
  },
  saveChanges: (saveChanges: boolean): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.DialogManagement.SaveChanges, saveChanges)
  }
})

contextBridge.exposeInMainWorld('log', {
  log: (...args) => ipcRenderer.invoke(IpcEventNames.Log.Log, ...args),
  info: (...args) => ipcRenderer.invoke(IpcEventNames.Log.Info, ...args),
  warn: (...args) => ipcRenderer.invoke(IpcEventNames.Log.Warn, ...args),
  error: (...args) => ipcRenderer.invoke(IpcEventNames.Log.Error, ...args)
})