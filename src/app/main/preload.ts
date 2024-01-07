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
    return Promise.resolve(i18n.store.data)
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
  saveFile: (path: string, data: string): Promise<void> => {
    return ipcRenderer.invoke('electron:saveFile', path, data)
  }
})