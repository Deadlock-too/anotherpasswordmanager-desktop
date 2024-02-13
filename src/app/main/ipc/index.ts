import { BrowserWindow, clipboard, ipcMain, nativeTheme, Menu } from 'electron'
import { openFileDialog, openFileFromPath, saveFileDialog } from '../utils/windowManager'
import { daisyui } from '../../../../tailwind.config'
import * as fs from 'fs'
import IpcEventNames from './ipcEventNames'
import {
  applyCloseToTray, applyMinimizeToTray,
  getLanguageFromConfig,
  getThemeFromConfig,
  readConfig,
  writeConfig
} from '../utils/configManager'
import { Config, Language, Theme } from '../../../types'
import { Folder, UUID } from '../../renderer/common/types'
import Main from '../main'

let currentShouldUseDarkColors = nativeTheme.shouldUseDarkColors

/**
 * Ipc events
 */
nativeTheme.on('updated', () => {
  if (currentShouldUseDarkColors === nativeTheme.shouldUseDarkColors || nativeTheme.themeSource !== 'system')
    return

  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.Theming.UpdateIsDark, nativeTheme.shouldUseDarkColors)
  })

  currentShouldUseDarkColors = nativeTheme.shouldUseDarkColors
})


/**
 * Ipc event handlers
 */
ipcMain.handle(IpcEventNames.FileManagement.Open, async (): Promise<void> => {
  return await openFileDialog()
})

ipcMain.handle(IpcEventNames.FileManagement.Save, async (): Promise<string | undefined> => {
  return await saveFileDialog()
})

ipcMain.handle(IpcEventNames.FileOpen.SetFileContent, async (_, path: string, password: string): Promise<void> => {
  return await openFileFromPath(path, password)
})

ipcMain.handle(IpcEventNames.Theming.GetStartupTheme, async (): Promise<Theme> => {
  const theme = await getThemeFromConfig()
  return theme.currentTheme
})

ipcMain.handle(IpcEventNames.Localization.GetStartupLanguage, async (): Promise<Language> => {
  return await getLanguageFromConfig()
})

ipcMain.handle(IpcEventNames.Theming.SetTheme, async (_, themeName, setSystem): Promise<boolean> => {
  const theme = daisyui.themes.find(t => themeName in t)[themeName]

  if (setSystem) {
    nativeTheme.themeSource = 'system'
  } else {
    nativeTheme.themeSource = theme['color-scheme']
  }

  const isDark = theme['color-scheme'] === 'dark'
  const color = theme['base-100']
  const content = theme['base-content'] ?? (isDark ? '#ffffff' : '#000000')

  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.Theming.UpdateTheme, themeName)
    try {
      window.setTitleBarOverlay({
        color: color,
        symbolColor: content
      })
    } catch (e) {
      //TODO ID-10

      //Ignore error, there is no way to check if the window has a title bar so for the moment just ignore the error
    }
  })

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle(IpcEventNames.Theming.IsDark, () => {
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle(IpcEventNames.Theming.IsSystem, () => {
  return nativeTheme.themeSource === 'system'
})

ipcMain.handle(IpcEventNames.Theming.SetSystem, () => {
  nativeTheme.themeSource = 'system'
})

ipcMain.handle(IpcEventNames.Clipboard.Read, async (): Promise<string> => {
  return clipboard.readText('clipboard')
})

ipcMain.handle(IpcEventNames.Clipboard.Write, async (_, args): Promise<void> => {
  return clipboard.writeText(args, 'clipboard')
})

ipcMain.handle(IpcEventNames.Electron.SaveFile, async (_, path: string, data: string): Promise<void> => {
  fs.writeFileSync(path, data, { encoding: 'utf-8' })
})

ipcMain.handle(IpcEventNames.Config.Get, (): Promise<Config> => {
  return readConfig()
})

ipcMain.handle(IpcEventNames.Config.Set, async (_, data: Config): Promise<void> => {
  await writeConfig(data)
})

ipcMain.handle(IpcEventNames.Config.Update, () => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.Config.Update)
  })
})

ipcMain.handle(IpcEventNames.Config.OpenAtStartup, async (_, openAtStartup: boolean): Promise<void> => {
  Main.setOpenAtStartup(openAtStartup)
})

ipcMain.handle(IpcEventNames.Config.MinimizeToTray, async (_, minimizeToTray: boolean): Promise<void> => {
  await applyMinimizeToTray(minimizeToTray)
})

ipcMain.handle(IpcEventNames.Config.CloseToTray, async (_, closeToTray: boolean): Promise<void> => {
  await applyCloseToTray(closeToTray)
})

ipcMain.handle(IpcEventNames.Localization.ChangeLanguage, async (_, lang: string): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.Localization.ChangeLanguage, lang)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.AddFolder, async (_, folder: Folder): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.AddFolder, folder)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.GetDeletingRecordInfo, async (_, recordType): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.GetDeletingRecordInfo, recordType)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.GetDeletingRecordInfoResult, async (_, result): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.GetDeletingRecordInfoResult, result)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.DeleteEntry, async (_, id: UUID): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.DeleteEntry, id)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.CancelDeleteEntry, async (): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.CancelDeleteEntry)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.DeleteFolder, async (_, id: UUID): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.DeleteFolder, id)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.CancelDeleteFolder, async (): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.CancelDeleteFolder)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.SetPassword, async (_, password: string): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.SetPassword, password)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.SetFileContent, async (_, password: string): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.SetFileContent, password)
  })
})

ipcMain.handle(IpcEventNames.DialogManagement.SetInitialized, async (): Promise<void> => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.DialogManagement.SetInitialized)
  })
})

/**
 * Logging events handlers (usable from renderer process, mainly for secondary windows that could not open dev tools)
 */
ipcMain.handle(IpcEventNames.Log.Log, (_, ...args): void => {
  const label = 'Log'
  console.log(`${ label }-${ getCurrentTimestamp() }:`, ...args)
})
ipcMain.handle(IpcEventNames.Log.Info, (_, ...args): void => {
  const label = 'Info'
  console.info(`${ label }-${ getCurrentTimestamp() }:`, ...args)
})
ipcMain.handle(IpcEventNames.Log.Warn, (_, ...args): void => {
  const label = 'Warn'
  console.warn(`${ label }-${ getCurrentTimestamp() }:`, ...args)
})
ipcMain.handle(IpcEventNames.Log.Error, (_, ...args): void => {
  const label = 'Error'
  console.error(`${ label }-${ getCurrentTimestamp() }:`, ...args)
})

/**
 * Helper functions
 */
const getCurrentTimestamp = (): string => {
  const currentTime = new Date(Date.now())
  return `${ currentTime.getHours().toString().padStart(2, '0') }:${ currentTime.getMinutes().toString().padStart(2, '0') }:${ currentTime.getSeconds().toString().padStart(2, '0') }.${ currentTime.getMilliseconds().toString().padEnd(3, '0') }`
}