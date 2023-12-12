import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})

contextBridge.exposeInMainWorld('theming', {
  darkMode: {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system')
  }
})

contextBridge.exposeInMainWorld('dialog', {
  openFile: {
    open: async (): Promise<string> => {
      const result = await ipcRenderer.invoke('open-file:open')
      console.log(`Result: ${ JSON.stringify(result) }`)
      return result
    }
  }
})