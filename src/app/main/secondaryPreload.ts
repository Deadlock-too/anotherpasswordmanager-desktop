import { contextBridge, ipcRenderer } from 'electron'
import i18n from '../../i18n'
import IpcEventNames from './ipc/ipcEventNames'
import { Config } from '../../types'

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

contextBridge.exposeInMainWorld('theming', {
  darkMode: {
    isDark: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.IS_DARK),
    toggle: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.TOGGLE),
    system: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.SYSTEM)
  }
})

contextBridge.exposeInMainWorld('clipboard', {
  read: (): Promise<string> => {
    return ipcRenderer.invoke(IpcEventNames.CLIPBOARD.READ)
  },
  write: (text: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.CLIPBOARD.WRITE, text)
  }
})

contextBridge.exposeInMainWorld('settings', {
  readConfig: (): Promise<Config> => {
    return ipcRenderer.invoke(IpcEventNames.CONFIG.GET)
  },
  writeConfig: (config: Config): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.CONFIG.SET, config)
  }
})