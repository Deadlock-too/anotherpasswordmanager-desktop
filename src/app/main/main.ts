import { BrowserWindow, dialog } from 'electron'
import { openMainWindow } from './utils/windowManager'
import { init } from './services/init'
import './ipc'
import IpcEventNames from './ipc/ipcEventNames'
import { setShortcuts } from './utils/shortcutManager'

export default class Main {
  static mainWindow: Electron.BrowserWindow
  static application: Electron.App
  static BrowserWindow: typeof BrowserWindow
  static StartupUrl: string | null

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static async onReady() : Promise<BrowserWindow> {
    return await openMainWindow()
  }

  // TODO Move logic to protocol dedicated class
  // private static onOpenUrl(event: Electron.IpcMainEvent, url: string) {
  //   if (url.startsWith('anotherpasswordmanager://')) {
  //     //TODO: open url handle protocol
  //   }
  // }

  private static onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      Main.onReady()
    }
  }

  private static manageLock() {
    const gotTheLock = Main.application.requestSingleInstanceLock()
    if (!gotTheLock) {
      Main.application.quit()
    } else {
      Main.application.on('second-instance', async (event, argv) => {
        const window = await openMainWindow()
        Main.setStartupUrl(argv)
        if (Main.StartupUrl) {
          window.webContents.send(IpcEventNames.FileOpen.OpenFromPath, Main.StartupUrl)
          Main.StartupUrl = null
        }
      })
    }
  }

  private static setStartupUrl(argv: string[]) {
    for (const arg of argv) {
      if (arg.startsWith('anotherpasswordmanager://') || arg.endsWith('.apm')) {
        this.StartupUrl = arg
      }
    }
  }

  private static manageProtocol() {
    // TODO Manage protocol
    // if (process.defaultApp) {
    //   if (process.argv.length >= 2) {
    //     Main.application.setAsDefaultProtocolClient('anotherpasswordmanager', process.execPath, [path.resolve(process.argv[1])])
    //   } else {
    //     Main.application.setAsDefaultProtocolClient('anotherpasswordmanager')
    //   }
    // }
  }

  private static manageOpenFile() {
    Main.setStartupUrl(process.argv)

    this.application.on('open-file', (event, path) => {
      event.preventDefault()
      Main.StartupUrl = path
    })
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    Main.BrowserWindow = browserWindow
    Main.application = app
    this.StartupUrl = null
    Main.manageLock()
    Main.manageOpenFile()
    Main.application.whenReady()
      .then(async () => await init(Main.application))
      .then(async () => await setShortcuts(Main.application))
      .then(async () => {
        // TODO MANAGE WITH SETTING
        const startInBackground = false
        if (startInBackground) {
          return
        }
        Main.mainWindow = await Main.onReady()
        if (Main.StartupUrl) {
          Main.mainWindow.webContents.send(IpcEventNames.FileOpen.OpenFromPath, Main.StartupUrl)
          Main.StartupUrl = null
        }

        // TODO DO NOT CLOSE ONLY IF MODIFIED AND ADD i18n
        // Main.mainWindow.on('close', (e) => {
        //   const choice = dialog.showMessageBoxSync(Main.mainWindow, {
        //     type: 'question',
        //     buttons: ['Yes', 'No'],
        //     title: 'Confirm',
        //     message: 'Are you sure you want to quit?'
        //   })
        //   if (choice === 1) {
        //     e.preventDefault()
        //   }
        // })
      })
      .catch((e) => {
        console.error(e)
        Main.application.quit()
      })
    // Main.application.on('ready', Main.onReady)

    // TODO Move logic to when ready
    // Main.application.whenReady()

    // TODO Move logic to window manager and when ready
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('activate', Main.onActivate)

    // TODO onOpenUrl
    //Main.application.on('open-url', Main.onOpenUrl)

    // TODO Move logic to protocol dedicated class
    Main.manageProtocol()
  }
}

//TODO MANAGE AUTO UPDATE