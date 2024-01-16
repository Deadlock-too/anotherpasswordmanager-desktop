import { BrowserWindow, dialog, ipcMain } from 'electron'
import i18n from '../../../i18n'
import * as fs from 'fs'
import { decrypt } from './crypt'
import IpcEventNames from '../ipc/ipcEventNames'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

let mainWindow: BrowserWindow | null

async function createMainWindow() {
  function onClose() {
    // Dereference the window object.
    mainWindow = null
  }

  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    },
    height: 600,
    width: 800,
    minHeight: 300,
    minWidth: 550,
    titleBarStyle: 'hidden',
    /* TODO MAKE DYNAMIC BASED ON CURRENT SAVED THEME */
    /* TODO MANAGE OPENED DIALOG COLOR */
    titleBarOverlay: {
      color: '#1d232a',
      symbolColor: '#ffffff',
      height: 30 /* TODO MANAGE DARWIN PLATFORM DYNAMIC TITLE BAR HEIGHT (Low priority as not testable without device with Darwin platform) */
    }
  })

  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.on('closed', onClose)

  mainWindow.webContents.openDevTools()
}

export async function changeTitleBarOverlayTheme(color: string, symbolColor: string) {
  const window = BrowserWindow.getFocusedWindow()
  window?.setTitleBarOverlay({
    color: color,
    symbolColor: symbolColor
  })
}

export async function openMainWindow(targetRoute: string | null = null): Promise<BrowserWindow> {
  let windows = BrowserWindow.getAllWindows()
  if (windows.length === 0) {
    await createMainWindow()
    windows = BrowserWindow.getAllWindows()
  } else {
    windows[0].show()
    windows[0].focus()
  }
  if (targetRoute) {
    windows[0].webContents.send('route', targetRoute)
  }
  return windows[0]
}

export async function onWindowAllClosed(app: Electron.App) {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

export async function openFileDialog() {
  let content: string | undefined = undefined
  if (mainWindow) {
    await dialog.showOpenDialog(mainWindow, {
      title: i18n.t('OpenDialog.Title'),
      properties: [ 'openFile' ],
      filters: [
        { name: 'Apm files', extensions: [ 'apm' ] } //TODO ADD SUPPORT FOR APM FILES
      ]
    }).then(
      (result) => {
        if (!result.canceled && result.filePaths.length > 0 && mainWindow) {
          const path = result.filePaths[0]
          content = fs.readFileSync(path).toString()

          //Try to parse the file as JSON to check if it's not encrypted
          let output
          try {
            output = JSON.parse(content)
          } catch (e) { /* File is not JSON, so it's encrypted */ }

          if (output && typeof output === 'object') {
            mainWindow.webContents.send(IpcEventNames.FILE_OPEN.OPENED, path, content)
          } else { //If it's not JSON, it's encrypted
            const eventName = IpcEventNames.PASSWORD.RESULT
            ipcMain.removeHandler(eventName)
            ipcMain.handleOnce(eventName, (_, password) => {
              const decryptedContent = decrypt(content!, password)
              try {
                output = JSON.parse(decryptedContent)
                mainWindow!.webContents.send(IpcEventNames.FILE_OPEN.OPENED, path, decrypt(content!, password))
              } catch (e) {
                mainWindow!.webContents.send(IpcEventNames.FILE_OPEN.FAILED, path, content)
              }
            })

            mainWindow.webContents.send(IpcEventNames.PASSWORD.INPUT)
          }
        }
      }).catch((err) => {
      console.error(`Error: ${ err }`)
    })
  }
}

export async function saveFileDialog() {
  let path: string | undefined = undefined
  await dialog.showSaveDialog({
    'title': i18n.t('SaveDialog.Title'),
    'defaultPath': 'passwords.apm', //TODO CHOOSE DEFAULT FILE NAME
    properties: [ 'showOverwriteConfirmation' ]
  }).then(
    (result) => {
      if (!result.canceled && result.filePath)
        path = result.filePath
    }).catch((err) => {
      console.error(`Error: ${ err }`)
    }
  )
  return path
}
