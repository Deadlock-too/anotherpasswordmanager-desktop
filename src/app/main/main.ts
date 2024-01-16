import { BrowserWindow } from 'electron'
import { openMainWindow } from './utils/windowManager'
import * as path from 'path'
import { init } from './services/init'
import './ipc'

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

  private static async onReady() {
    await openMainWindow()
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
      Main.application.on('second-instance', () => {
        if (Main.mainWindow) {
          if (Main.mainWindow.isMinimized()) {
            Main.mainWindow.restore()
          }
          Main.mainWindow.focus()
        }
      })
    }
  }

  private static manageProtocol() {
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        Main.application.setAsDefaultProtocolClient('anotherpasswordmanager', process.execPath, [path.resolve(process.argv[1])])
      } else {
        Main.application.setAsDefaultProtocolClient('anotherpasswordmanager')
      }
    }
  }

  // TODO: Continue implementation (see example in this github repo: https://github.com/gary-archer/oauth.desktopsample.final/blob/master/src/main.ts#L127)
  // private static manageOpenFile() {
  //   for (const arg of process.argv) {
  //     if (arg.startsWith('anotherpasswordmanager://')) {
  //       this.StartupUrl = arg
  //     } else if (arg.endsWith('.apm')) {
  //       this.StartupUrl = arg
  //     }
  //   }
  //
  //   this.application.on('open-file', (event, path) => {
  //     event.preventDefault()
  //     this.StartupUrl = path
  //   })
  // }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    Main.BrowserWindow = browserWindow
    Main.application = app
    this.StartupUrl = null
    Main.manageLock()
    //Main.manageOpenFile()
    Main.application.whenReady()
      .then(async () => await init())
      .then(async () => {
        // TODO MANAGE WITH SETTING
        const startInBackground = false
        if (startInBackground) {
          return
        }
        await openMainWindow()
      })
      .catch((e) => {
        console.error(e)
        Main.application.quit()
      })
    Main.application.on('ready', Main.onReady)

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