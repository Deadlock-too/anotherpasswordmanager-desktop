import { BrowserWindow, clipboard, ipcMain, nativeTheme } from 'electron'
import { openFileDialog, openFileFromPath, saveFileDialog } from '../utils/windowManager'
import { daisyui } from '../../../../tailwind.config'
import * as fs from 'fs'
import IpcEventNames from './ipcEventNames'
import {
  applyAutoLockOnLock,
  applyAutoLockOnMinimize,
  applyAutoLockOnSleep,
  applyCloseToTray,
  applyMinimizeToTray,
  getLanguageFromConfig,
  getThemeFromConfig,
  readConfig,
  writeConfig
} from '../utils/configManager'
import { Config, Language, Theme } from '../../../types'
import Main from '../main'
import { ConfigIdentifiers } from '../consts'

let currentShouldUseDarkColors = nativeTheme.shouldUseDarkColors

//TODO ID-25
const propagateToAllWindows = (eventName: string, ...args: any[]) => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(eventName, ...args)
  })
}


/**
 * Ipc events
 */
nativeTheme.on('updated', () => {
  if (currentShouldUseDarkColors === nativeTheme.shouldUseDarkColors || nativeTheme.themeSource !== 'system')
    return

  propagateToAllWindows(IpcEventNames.App.Theming.UpdateIsDark, nativeTheme.shouldUseDarkColors)

  currentShouldUseDarkColors = nativeTheme.shouldUseDarkColors
})


/**
 * Ipc event handlers
 */
ipcMain.handle(IpcEventNames.App.File.OpenDialog, async (): Promise<void> => {
  return await openFileDialog()
})

ipcMain.handle(IpcEventNames.App.File.SaveDialog, async (): Promise<string | undefined> => {
  return await saveFileDialog()
})

ipcMain.handle(IpcEventNames.App.File.Open, async (_, path: string, password: string): Promise<void> => {
  return await openFileFromPath(path, password)
})

ipcMain.handle(IpcEventNames.App.Theming.GetStartupTheme, async (): Promise<Theme> => {
  const theme = await getThemeFromConfig()
  return theme.currentTheme
})

ipcMain.handle(IpcEventNames.App.Localization.GetStartupLanguage, async (): Promise<Language> => {
  return await getLanguageFromConfig()
})

ipcMain.handle(IpcEventNames.App.Theming.SetTheme, async (_, themeName, setSystem): Promise<boolean> => {
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
    window.webContents.send(IpcEventNames.App.Theming.UpdateTheme, themeName)
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

ipcMain.handle(IpcEventNames.App.Theming.IsDark, () => {
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle(IpcEventNames.App.Theming.IsSystem, () => {
  return nativeTheme.themeSource === 'system'
})

ipcMain.handle(IpcEventNames.App.Theming.SetSystem, () => {
  nativeTheme.themeSource = 'system'
})

ipcMain.handle(IpcEventNames.System.Clipboard.Read, async (): Promise<string> => {
  return clipboard.readText('clipboard')
})

ipcMain.handle(IpcEventNames.System.Clipboard.Write, async (_, args): Promise<void> => {
  return clipboard.writeText(args, 'clipboard')
})

ipcMain.handle(IpcEventNames.System.Clipboard.Clear, async (): Promise<void> => {
  return clipboard.clear()
})

ipcMain.handle(IpcEventNames.App.File.Save, async (_, path: string, data: string): Promise<void> => {
  fs.writeFileSync(path, data, { encoding: 'utf-8' })
})

ipcMain.handle(IpcEventNames.App.Config.Get, (): Promise<Config> => {
  return readConfig()
})

ipcMain.handle(IpcEventNames.App.Config.Set, async (_, data: Config): Promise<void> => {
  await writeConfig(data)
})

ipcMain.handle(IpcEventNames.App.Config.Refresh, () => {
  propagateToAllWindows(IpcEventNames.App.Config.Refresh)
})

ipcMain.handle(IpcEventNames.App.Config.Apply, async (_, configIdentifier: string, value: any): Promise<void> => {
  switch (configIdentifier) {
    case ConfigIdentifiers.OpenAtStartup: {
      Main.setOpenAtStartup(value)
      break
    }
    case ConfigIdentifiers.MinimizeToTray: {
      await applyMinimizeToTray(value)
      break
    }
    case ConfigIdentifiers.CloseToTray: {
      await applyCloseToTray(value)
      break
    }
    case ConfigIdentifiers.AutoLockOnMinimize: {
      await applyAutoLockOnMinimize(value)
      break
    }
    case ConfigIdentifiers.AutoLockOnSleep: {
      await applyAutoLockOnSleep(value)
      break
    }
    case ConfigIdentifiers.AutoLockOnLock: {
      await applyAutoLockOnLock(value)
      break
    }
  }
})

ipcMain.handle(IpcEventNames.App.Lock, async (): Promise<void> => {
  propagateToAllWindows(IpcEventNames.App.Lock)
})

ipcMain.handle(IpcEventNames.App.Localization.ChangeLanguage, async (_, lang: string): Promise<void> => {
  propagateToAllWindows(IpcEventNames.App.Localization.ChangeLanguage, lang)
})

ipcMain.handle(IpcEventNames.Electron.Events.Propagate, async (_, eventName: string, ...args: any[]): Promise<void> => {
  propagateToAllWindows(eventName, ...args)
})

ipcMain.handle(IpcEventNames.Electron.Events.PropagateResult, async (_, eventName: string, result: any): Promise<void> => {
  propagateToAllWindows(eventName, result)
})

/**
 * Logging events handlers (usable from renderer process, mainly for secondary windows that could not open dev tools)
 */
ipcMain.handle(IpcEventNames.Electron.Log, (_, ...args): void => {
  console.log(`${ getCurrentTimestamp() }:`, ...args)
})

/**
 * Helper functions
 */
const getCurrentTimestamp = (): string => {
  const currentTime = new Date(Date.now())
  return `${ currentTime.getHours().toString().padStart(2, '0') }:${ currentTime.getMinutes().toString().padStart(2, '0') }:${ currentTime.getSeconds().toString().padStart(2, '0') }.${ currentTime.getMilliseconds().toString().padEnd(3, '0') }`
}