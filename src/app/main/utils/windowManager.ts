import { BrowserWindow, dialog } from 'electron'
import i18n from '../../../i18n'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

async function createMainWindow() {
  function onClose() {
    // Dereference the window object.
    mainWindow = null
  }

  let mainWindow: BrowserWindow | null = new BrowserWindow({
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
  let path: string | undefined = undefined
  await dialog.showOpenDialog({
    properties: ['openFile']
  }).then(
    (result) => {
      if (!result.canceled && result.filePaths.length > 0)
        path = result.filePaths[0]
    }).catch((err) => {
    console.error(`Error: ${ err }`)
  })
  console.log(`Opening path: ${ path }`)
  return path
}

export async function saveFileDialog() {
  let path: string | undefined = undefined
  await dialog.showSaveDialog({
    'title': i18n.t('saveFile'),
    'defaultPath': 'passwords.apm',
    properties: ['showOverwriteConfirmation']
  }).then(
    (result) => {
      if (!result.canceled && result.filePath)
        path = result.filePath
    }).catch((err) => {
      console.error(`Error: ${ err }`)
    }
  )
  console.log(`Saving path: ${ path }`)
  return path
}
