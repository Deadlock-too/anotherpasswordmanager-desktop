import { ipcMain, nativeTheme } from 'electron'
import { changeTitleBarOverlayTheme, openFileDialog, saveFileDialog } from './utils/windowManager'
// import { daisyui } from '../../../tailwind.config.js'

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
ipcMain.handle('file-management:open', async () : Promise<string | undefined> => {
  return await openFileDialog()
})

ipcMain.handle('file-management:save', async () : Promise<string | undefined> => {
  return await saveFileDialog()
})

ipcMain.handle('dark-mode:toggle', async () : Promise<boolean> => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }

  //TODO MANAGE SWITCH BAR OVERLAY THEME
  /*
  * Copy all default values to current tailwind.config.js and use .find() to get the desired theme.
  * Save the current theme on a json file that will be used to reinstate the theme on the next launch.
  * Use the file to save other settings too.
  *
  * Fix the localization problem on the render side, then make a minimal interface to manage and create the passwords thinking only after to improve it.
  */

  // let lightTheme = daisyui.themes['light']
  // let darkTheme = daisyui.themes['dark']
  //
  // console.log(daisyui.themes.light)
  // console.log(daisyui.themes.dark)

  // await changeTitleBarOverlayTheme(
  //   // nativeTheme.shouldUseDarkColors ? '#000000' : '#1d232a',
  //   // nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000'
  // nativeTheme.shouldUseDarkColors ? darkTheme['base-100'] : lightTheme['base-100'],
  //   nativeTheme.shouldUseDarkColors ? '#ffffff' : '#000000'
  // )

  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})