import { BrowserWindow, dialog } from 'electron'
import i18n from '../../../i18n'
import * as fs from 'fs'
import { decrypt } from './crypt'
import IpcEventNames from '../ipc/ipcEventNames'
import { getThemeFromConfig } from './configManager'

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

  const theme = await getThemeFromConfig()
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
    /* TODO MANAGE OPENED DIALOG OR SECONDARY MODAL WINDOW COLOR (if any dialog is opened set darker color, for an easier job compute all colors starting from the title bar color using HSL subtracting 5 to the last value and set a new field in the tailwind.config.js) */
    titleBarOverlay: {
      color: theme.color,
      symbolColor: theme.symbolColor,
      height: 30 /* TODO MANAGE DARWIN PLATFORM DYNAMIC TITLE BAR HEIGHT (Low priority as not testable without device with Darwin platform) */
    }
  })

  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.on('closed', onClose)

  mainWindow.webContents.setWindowOpenHandler((details) => {

    let mainWindowState = JSON.parse(details.features)

    let height = mainWindowState.height - 100
    let width = mainWindowState.width - 100
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
    } else if (details.frameName === 'addFolder') {
      height = 250
      width = 450
      minHeight = 1
      minWidth = 1
    }

    const x = Math.round((mainWindowState ? mainWindowState.x : 0) + (mainWindowState ? mainWindowState.width / 2 : 0) - width / 2)
    const y = Math.round((mainWindowState ? mainWindowState.y : 0) + (mainWindowState ? mainWindowState.height / 2 : 0) - height / 2)

    return {
      action: 'allow',
      outlivesOpener: false,
      overrideBrowserWindowOptions: {
        height: height,
        width: width,
        minHeight: minHeight,
        minWidth: minWidth,
        titleBarStyle: 'hidden',
        skipTaskbar: true,
        minimizable: false,
        maximizable: false,
        resizable: resizable,
        titleBarOverlay: false,
        // titleBarOverlay: {
        //   color: '#1d232a',
        //   symbolColor: '#ffffff',
        //   height: 30 /* TODO MANAGE DARWIN PLATFORM DYNAMIC TITLE BAR HEIGHT (Low priority as not testable without device with Darwin platform) */
        // },
        // icon: './assets/icon.png', //TODO ADD ICON
        x: x,
        y: y,
        parent: mainWindow ?? undefined,
        modal: true,
        webPreferences: {
          preload: SECONDARY_WINDOW_PRELOAD_WEBPACK_ENTRY
        }
      }
    }
  })

  mainWindow.webContents.openDevTools()

  mainWindow.webContents.send(IpcEventNames.Electron.SetSecondaryWindowEntry, SECONDARY_WINDOW_WEBPACK_ENTRY)
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
      title: i18n.default.t('OpenDialog.Title'),
      properties: [ 'openFile' ],
      filters: [
        { name: 'Apm files', extensions: [ 'apm' ] }
      ]
    }).then(
      (result) => {
        if (!result.canceled && result.filePaths.length > 0 && mainWindow) {
          const path = result.filePaths[0]
          mainWindow.webContents.send(IpcEventNames.FileOpen.OpenFromPath, path)
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
      mainWindow?.webContents.send(IpcEventNames.FileOpen.Failed, path, content)
      return
    }
  }

  mainWindow?.webContents.send(IpcEventNames.FileOpen.Opened, path, result)
}

export async function saveFileDialog() {
  let path: string | undefined = undefined
  await dialog.showSaveDialog({
    'title': i18n.default.t('SaveDialog.Title'),
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