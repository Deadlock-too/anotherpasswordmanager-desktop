import { dialog, ipcMain } from 'electron'

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
ipcMain.handle('open-dialog', async (event) => {
  dialog.showOpenDialog({
    properties: ['openFile']
  }).then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
  })
    .catch((err) => {
      console.error(err)
    })
})