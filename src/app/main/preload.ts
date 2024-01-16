import { contextBridge, ipcRenderer } from 'electron'
import i18n from '../../i18n'
import IpcEventNames from './ipc/ipcEventNames'

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

contextBridge.exposeInMainWorld('theming', {
  darkMode: {
    isDark: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.IS_DARK),
    toggle: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.TOGGLE),
    system: () => ipcRenderer.invoke(IpcEventNames.DARK_MODE.SYSTEM)
  }
})

contextBridge.exposeInMainWorld('dialog', {
  fileManagement: {
    open: (): Promise<void> => {
      return ipcRenderer.invoke(IpcEventNames.FILE_MANAGEMENT.OPEN)
    },
    save: (): Promise<string | undefined> => {
      return ipcRenderer.invoke(IpcEventNames.FILE_MANAGEMENT.SAVE)
    }
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

contextBridge.exposeInMainWorld('electron', {
  subscribeToFileOpened: (callback) => {
    ipcRenderer.on(IpcEventNames.FILE_OPEN.OPENED, (event, ...args) => callback(...args))
  },
  unsubscribeToFileOpened: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.FILE_OPEN.OPENED)
  },
  subscribeToPasswordInput: (callback) => {
    ipcRenderer.on(IpcEventNames.PASSWORD.INPUT, (event, ...args) => callback(...args))
  },
  unsubscribeToPasswordInput: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.PASSWORD.INPUT)
  },
  subscribeToFailedOpenFile: (callback) => {
    ipcRenderer.on(IpcEventNames.FILE_OPEN.FAILED, (event, ...args) => callback(...args))
  },
  unsubscribeToFailedOpenFile: () => {
    ipcRenderer.removeAllListeners(IpcEventNames.FILE_OPEN.FAILED)
  },
  sendPasswordResult: (password: string) => {
    return ipcRenderer.invoke(IpcEventNames.PASSWORD.RESULT, password)
  },
  saveFile: (path: string, data: string): Promise<void> => {
    return ipcRenderer.invoke(IpcEventNames.ELECTRON.SAVE_FILE, path, data)
  }
})