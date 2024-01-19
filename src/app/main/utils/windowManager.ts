import { BrowserWindow, dialog } from 'electron'
import i18n from '../../../i18n'
import * as fs from 'fs'
import { decrypt } from './crypt'
import IpcEventNames from '../ipc/ipcEventNames'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

declare const SECONDARY_WINDOW_WEBPACK_ENTRY: string
declare const SECONDARY_WINDOW_PRELOAD_WEBPACK_ENTRY: string

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
    // icon: './assets/icon.png', //TODO ADD ICON
    /* TODO MAKE DYNAMIC BASED ON CURRENT SAVED THEME */
    /* TODO MANAGE OPENED DIALOG COLOR (if any dialog is opened set darker color) */
    titleBarOverlay: {
      color: '#1d232a',
      symbolColor: '#ffffff',
      height: 30 /* TODO MANAGE DARWIN PLATFORM DYNAMIC TITLE BAR HEIGHT (Low priority as not testable without device with Darwin platform) */
    }
  })

  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.on('closed', onClose)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    let height = (mainWindow?.getSize()[1] ?? 600) - 100
    let width = (mainWindow?.getSize()[0] ?? 800) - 100
    let minHeight = 300
    let minWidth = 550
    let resizable = false

    //use frameName to identify which window is being opened
    if (details.frameName === 'settings') {
      height = 600
      width = 800
      minHeight = 300
      minWidth = 550
      resizable = true
    }

    return {
      action: 'allow',
      outlivesOpener: false,
      overrideBrowserWindowOptions: {
        height: height,
        width: width,
        minHeight: minHeight,
        minWidth: minWidth,
        titleBarStyle: 'hidden', //re-enable when title bar overlay is finished
        skipTaskbar: true,
        minimizable: false,
        maximizable: false,
        resizable: resizable,
        titleBarOverlay: false,
        // icon: './assets/icon.png', //TODO ADD ICON
        // x: (mainWindow?.getPosition()[0] ?? 0) + 25,
        // y: (mainWindow?.getPosition()[1] ?? 0) + 25,
        parent: mainWindow ?? undefined,
        modal: true,
        webPreferences: {
          preload: SECONDARY_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
      }
    }
  })

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
    windows[0].webContents.send(IpcEventNames.ROUTE, targetRoute)
  }
  return windows[0]
}

export async function onWindowAllClosed(app: Electron.App) {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

export async function openFileDialog() {
  if (mainWindow) {
    await dialog.showOpenDialog(mainWindow, {
      title: i18n.t('OpenDialog.Title'),
      properties: [ 'openFile' ],
      filters: [
        { name: 'Apm files', extensions: [ 'apm' ] }
      ]
    }).then(
      (result) => {
        if (!result.canceled && result.filePaths.length > 0 && mainWindow) {
          const path = result.filePaths[0]
          mainWindow.webContents.send(IpcEventNames.FILE_OPEN.OPEN_FROM_PATH, path)
        }
      }).catch((err) => {
      console.error(`Error: ${ err }`)
    })
  }
}

export async function openFileFromPath(path: string, password: string): Promise<void> {
  const content = fs.readFileSync(path).toString()
  let result: string
  const tryParseContent = (content: string) => {
    try {
      const rs = JSON.parse(content)
      return rs && typeof rs === 'object'
    } catch (e) {
      /* File is not JSON, so it's encrypted */
      return false
    }
  }
  if (tryParseContent(content)) {
    result = content
  } else {
    const decryptedContent = decrypt(content, password)
    if (tryParseContent(decryptedContent)) {
      result = decryptedContent
    } else {
      mainWindow?.webContents.send(IpcEventNames.FILE_OPEN.FAILED, path, content)
      return
    }
  }

  mainWindow?.webContents.send(IpcEventNames.FILE_OPEN.OPENED, path, result)
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
