import { contextBridge, ipcRenderer } from 'electron'
import i18n from '../../i18n'
import IpcEventNames from './ipc/ipcEventNames'
import { Config } from '../../types'

ipcRenderer.invoke(IpcEventNames.Theming.GetStartupTheme).then(theme => {
  contextBridge.exposeInMainWorld('theming', {
    startupTheme: theme,
    isDark: () => ipcRenderer.invoke(IpcEventNames.Theming.IsDark),
    setTheme: (theme: string, setSystem: boolean) => ipcRenderer.invoke(IpcEventNames.Theming.SetTheme, theme, setSystem),
    setSystem: () => ipcRenderer.invoke(IpcEventNames.Theming.SetSystem)
  })
})

contextBridge.exposeInMainWorld('localization', {
  changeLanguage: (lang: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      i18n.changeLanguage(lang, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  getInitialI18nStore: (): Promise<any> => {
    return Promise.resolve(i18n.default.store.data)
  }
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('system', {
  platform: () => process.platform,
})

contextBridge.exposeInMainWorld('dialog', {
  fileManagement: {
    open: (): Promise<void> => {
      return ipcRenderer.invoke(IpcEventNames.FileManagement.Open)
    },
    save: (): Promise<string | undefined> => {
      return ipcRenderer.invoke(IpcEventNames.FileManagement.Save)
    }
  }
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
  subscribeToFileOpened: (callback) => {
    ipcRenderer.on(IpcEventNames.FileOpen.Opened, (event, ...args) => callback(...args))
  },
  unsubscribeToFileOpened: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.FileOpen.Opened)
  },
  subscribeToFailedOpenFile: (callback) => {
    ipcRenderer.on(IpcEventNames.FileOpen.Failed, (event, ...args) => callback(...args))
  },
  unsubscribeToFailedOpenFile: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.FileOpen.Failed)
  },
  subscribeToOpenFileFromPath: (callback) => {
    ipcRenderer.on(IpcEventNames.FileOpen.OpenFromPath, (event, ...args) => callback(...args))
  },
  unsubscribeToOpenFileFromPath: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.FileOpen.OpenFromPath)
  },
  subscribeToUpdateTheme: (callback) => {
    ipcRenderer.on(IpcEventNames.Theming.UpdateTheme, (event, ...args) => callback(...args))
  },
  unsubscribeToUpdateTheme: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.Theming.UpdateTheme)
  },
  subscribeToUpdateIsDark: (callback) => {
    ipcRenderer.on(IpcEventNames.Theming.UpdateIsDark, (event, ...args) => callback(...args))
  },
  unsubscribeToUpdateIsDark: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.Theming.UpdateIsDark)
  },
  setFileContent: async (path: string, password: string) => {
    return await ipcRenderer.invoke(IpcEventNames.FileOpen.SetFileContent, path, password)
  },
  saveFile: (path: string, data: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Electron.SaveFile, path, data)
  },
  subscribeToSetSecondaryWindowEntry: (callback) => {
    ipcRenderer.on(IpcEventNames.Electron.SetSecondaryWindowEntry, (event, ...args) => callback(...args))
  },
  unsubscribeToSetSecondaryWindowEntry: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.Electron.SetSecondaryWindowEntry)
  },
})

contextBridge.exposeInMainWorld('settings', {
  readConfig: async (): Promise<Config> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Get)
  },
  writeConfig: (config: Config): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Set, config)
  }
})