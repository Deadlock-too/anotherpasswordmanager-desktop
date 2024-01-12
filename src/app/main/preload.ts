import { contextBridge, ipcRenderer } from 'electron'
import i18n from '../../i18n'

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
    isDark: () => ipcRenderer.invoke('darkMode:isDark'),
    toggle: () => ipcRenderer.invoke('darkMode:toggle'),
    system: () => ipcRenderer.invoke('darkMode:system')
  }
})

contextBridge.exposeInMainWorld('dialog', {
  fileManagement: {
    open: (): Promise<void> => {
      return ipcRenderer.invoke('fileManagement:open')
    },
    save: (): Promise<string | undefined> => {
      return ipcRenderer.invoke('fileManagement:save')
    }
  }
})

contextBridge.exposeInMainWorld('clipboard', {
  read: (): Promise<string> => {
    return ipcRenderer.invoke('clipboard:read')
  },
  write: (text: string): Promise<void> => {
    return ipcRenderer.invoke('clipboard:write', text)
  }
})

contextBridge.exposeInMainWorld('electron', {
  subscribeToFileOpened: (callback) => {
    ipcRenderer.on('file-opened', (event, ...args) => callback(...args))
  },
  unsubscribeToFileOpened: () => {
    ipcRenderer.removeAllListeners('file-opened')
  },
  subscribeToPasswordInput: (callback) => {
    ipcRenderer.on('password:input', (event, ...args) => callback(...args))
  },
  unsubscribeToPasswordInput: () => {
    ipcRenderer.removeAllListeners('password:input')
  },
  subscribeToFailedOpenFile: (callback) => {
    ipcRenderer.on('failed-open-file', (event, ...args) => callback(...args))
  },
  unsubscribeToFailedOpenFile: () => {
    ipcRenderer.removeAllListeners('failed-open-file')
  },
  sendPasswordResult: (password: string) => {
    return ipcRenderer.invoke('password:result', password)
  },
  saveFile: (path: string, data: string): Promise<void> => {
    return ipcRenderer.invoke('electron:saveFile', path, data)
  }
})