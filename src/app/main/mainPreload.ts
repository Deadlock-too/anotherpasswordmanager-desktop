import { contextBridge, ipcRenderer } from 'electron'
import { default as i18n } from '../../i18n'
import IpcEventNames from './ipc/ipcEventNames'
import { Config, Theme } from '../../types'

const RESULT_EVENT_SUFFIX = 'Result' //ID-20

/**
 * App
 */
contextBridge.exposeInMainWorld('app', {
  lock: () => ipcRenderer.invoke(IpcEventNames.App.Lock),
  file: {
    openDialog: () => ipcRenderer.invoke(IpcEventNames.App.File.OpenDialog),
    saveDialog: () => ipcRenderer.invoke(IpcEventNames.App.File.SaveDialog),
    save: (path: string, data: string) => ipcRenderer.invoke(IpcEventNames.App.File.Save, path, data),
    open: (path: string, password: string) => ipcRenderer.invoke(IpcEventNames.App.File.Open, path, password),
  },
  config: {
    get: () => ipcRenderer.invoke(IpcEventNames.App.Config.Get),
    set: (config: Config) => ipcRenderer.invoke(IpcEventNames.App.Config.Set, config),
    apply: (configIdentifier: string, value: any) => ipcRenderer.invoke(IpcEventNames.App.Config.Apply, configIdentifier, value),
    refresh: () => ipcRenderer.invoke(IpcEventNames.App.Config.Refresh),
  },
  theming: {
    startupThemeSync: () => {
      let theme: Theme = Theme.system
      let isWaiting = true
      ipcRenderer.invoke(IpcEventNames.App.Theming.GetStartupTheme)
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
    startupThemeAsync: ipcRenderer.invoke(IpcEventNames.App.Theming.GetStartupTheme),
    isDark: () => ipcRenderer.invoke(IpcEventNames.App.Theming.IsDark),
    isSystem: () => ipcRenderer.invoke(IpcEventNames.App.Theming.IsSystem),
    setTheme: (theme: string, setSystem: boolean) => ipcRenderer.invoke(IpcEventNames.App.Theming.SetTheme, theme, setSystem),
    setSystem: () => ipcRenderer.invoke(IpcEventNames.App.Theming.SetSystem)
  },
  localization: {
    changeLanguage: (lang: string) => i18n.default.changeLanguage(lang),
    getInitialI18nStore: (): Promise<any> => {
      return Promise.resolve(i18n.default.store.data)
    },
    startupLanguage: ipcRenderer.invoke(IpcEventNames.App.Localization.GetStartupLanguage)
  }
})

/**
 * Electron
 */
contextBridge.exposeInMainWorld('electron', {
  log: (...args) => ipcRenderer.invoke(IpcEventNames.Electron.Log, ...args),
  events: {
    subscribe: (eventName: string, callback) => ipcRenderer.on(eventName, (event, ...args) => callback(...args)),
    unsubscribe: (eventName: string) => ipcRenderer.removeAllListeners(eventName),
    subscribeToResult: (eventName: string, callback) => ipcRenderer.on(eventName + RESULT_EVENT_SUFFIX, (event, result) => callback(result)),
    unsubscribeFromResult: (eventName: string) => ipcRenderer.removeAllListeners(eventName + RESULT_EVENT_SUFFIX),
    propagate: (eventName: string, ...args: any[]) => ipcRenderer.invoke(IpcEventNames.Electron.Events.Propagate, eventName, ...args),
    propagateResult: <T>(eventName: string, result: T) => ipcRenderer.invoke(IpcEventNames.Electron.Events.PropagateResult, eventName + RESULT_EVENT_SUFFIX, result)
  },
  versions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron
  }
})

/**
 * System
 */
contextBridge.exposeInMainWorld('system', {
  platform: () => process.platform,
  clipboard: {
    read: () => ipcRenderer.invoke(IpcEventNames.System.Clipboard.Read),
    write: (text: string) => ipcRenderer.invoke(IpcEventNames.System.Clipboard.Write, text),
    clear: () => ipcRenderer.invoke(IpcEventNames.System.Clipboard.Clear)
  }
})