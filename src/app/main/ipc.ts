import { ipcMain, nativeTheme, clipboard } from 'electron'
import { changeTitleBarOverlayTheme, openFileDialog, saveFileDialog } from './utils/windowManager'
import { daisyui } from '../../../tailwind.config'
import { Theme } from 'daisyui'
import * as fs from 'fs'

/**
 * Ipc events
 */
// ipcMain.on('add-folder', async (event, arg) => {
//   const addFolderArgs: AddFolderArgs = JSON.parse(arg)
//   try {
//     event.reply('add-folder:reply', JSON.stringify({
//       success: true,
//       path: addFolderArgs.path
//     }))
//   } catch (err) {
//     console.error(err)
//     event.reply('add-folder:reply', JSON.stringify({
//       success: false,
//       error: err.message
//     }))
//   }
// })


/**
 * Ipc event handlers
 */
// ipcMain.handle('fileManagement:open', async (): Promise<string | undefined> => {
//   return await openFileDialog()
// })
ipcMain.handle('fileManagement:open', async (): Promise<void> => {
  return await openFileDialog()
})

ipcMain.handle('fileManagement:save', async (): Promise<string | undefined> => {
  return await saveFileDialog()
})

ipcMain.handle('darkMode:toggle', async (): Promise<boolean> => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  const lightThemeName = 'light'
  const darkThemeName = 'dark'
  const lightTheme = daisyui.themes.find((theme) => lightThemeName in theme) as Theme
  const darkTheme = daisyui.themes.find((theme) => darkThemeName in theme) as Theme
  await changeTitleBarOverlayTheme(
    nativeTheme.shouldUseDarkColors ? darkTheme[darkThemeName]['base-100'] : lightTheme[lightThemeName]['base-100'],
    nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000'
  )

  //TODO MANAGE THEME PERSISTENCE
  /*
  * Save the current theme on a json file that will be used to reinstate the theme on the next launch.
  * To correctly set the theme you need to set the custom html tag. Check DaisyUI docs for further clarification
  * Use the file to save other settings too.
  *
  * Fix the localization problem on the render side, then make a minimal interface to manage and create the passwords thinking only after to improve it.
  */

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('darkMode:isDark', () => {
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('darkMode:system', () => {
  nativeTheme.themeSource = 'system'
})

ipcMain.handle('clipboard:read', async (): Promise<string> => {
  return clipboard.readText('clipboard')
})

ipcMain.handle('clipboard:write', async (_, args): Promise<void> => {
  return clipboard.writeText(args, 'clipboard')
})

ipcMain.handle('electron:saveFile', async (_, path: string, data: string): Promise<void> => {
  //TODO SAVE FILE
  fs.writeFileSync(path, data, { encoding: 'utf-8' })
})