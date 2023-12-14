import { contextBridge, ipcRenderer } from 'electron'

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
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
  }
})

contextBridge.exposeInMainWorld('dialog', {
  fileManagement: {
    open: (): Promise<string | undefined> => {
      return ipcRenderer.invoke('file-management:open')
    },
    save: (): Promise<string | undefined> => {
      return ipcRenderer.invoke('file-management:save')
    }
  }
})