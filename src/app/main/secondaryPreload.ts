import { contextBridge, ipcRenderer } from 'electron'
import i18n from '../../i18n'
import IpcEventNames from './ipc/ipcEventNames'
import { Config, Theme } from '../../types'

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
  // changeLanguage: (lang: string): Promise<void> => {
  //   return new Promise((resolve, reject) => {
  //     i18n.changeLanguage(lang, (err) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve()
  //       }
  //     })
  //   })
  // }
  changeLanguage: (lang: string) => {
    i18n.changeLanguage(lang)
  },
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

contextBridge.exposeInMainWorld('settings', {
  readConfig: (): Promise<Config> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Get)
  },
  writeConfig: (config: Config): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.Config.Set, config)
  }
})