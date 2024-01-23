import { BrowserWindow, clipboard, ipcMain, nativeTheme } from 'electron'
import { openFileDialog, openFileFromPath, saveFileDialog } from '../utils/windowManager'
import { daisyui } from '../../../../tailwind.config'
import * as fs from 'fs'
import IpcEventNames from './ipcEventNames'
import { getThemeFromConfig, readConfig, writeConfig } from '../utils/configManager'
import { Config } from '../../../types'

let currentShouldUseDarkColors = nativeTheme.shouldUseDarkColors

/**
 * Ipc events
 */
nativeTheme.on('updated', () => {
  if (currentShouldUseDarkColors === nativeTheme.shouldUseDarkColors)
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

ipcMain.handle(IpcEventNames.Theming.GetStartupTheme, async (): Promise<string> => {
  const theme = await getThemeFromConfig()
  return theme.currentTheme
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
      // TODO IMPROVE THIS
      // Ignore error, there is no way to check if the window has a title bar so for the moment just ignore the error
    }
  })

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle(IpcEventNames.Theming.IsDark, () => {
  return nativeTheme.shouldUseDarkColors
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