import { BrowserWindow } from 'electron'
import { openMainWindow } from './utils/windowManager'
import { init } from './services/init'
import './ipc'
import IpcEventNames from './ipc/ipcEventNames'
import { setShortcuts } from './utils/shortcutManager'
import { applyConfig, getOpenMinimizedFromConfig } from './utils/configManager'
import * as process from 'process'
import { AppStateValues } from '../../types'
import { AppState } from '../../utils/appStateUtils'
import { createTray } from './utils/trayManager'

export default class Main {
  static mainWindow: Electron.BrowserWindow
  static application: Electron.App
  static browserWindow: typeof BrowserWindow
  static powerMonitor: typeof Electron.powerMonitor
  static startupUrl: string | null
  static tray: Electron.Tray | undefined
  static appState: AppState<AppStateValues> = new AppState(AppStateValues.None)

  public static getAppState() {
    return Main.appState
  }

  public static initialize() {
    Main.appState.add(AppStateValues.Initialized)
  }

  public static lock() {
    Main.appState.add(AppStateValues.Locked)
  }

  public static closing() {
    Main.appState.add(AppStateValues.Closing)
  }

  public static removeClosingFlag() {
    Main.appState.remove(AppStateValues.Closing)
  }

  public static reset() {
    Main.appState.remove(AppStateValues.Initialized)
    Main.appState.remove(AppStateValues.Locked)
  }

  public static async putOnTray() {
    Main.appState.add(AppStateValues.OnTray)
    await createTray()
  }

  public static removeFromTray() {
    Main.appState.remove(AppStateValues.OnTray)
  }

  public static unsavedChanges(unsavedChanges: boolean) {
    unsavedChanges ?
      Main.appState.add(AppStateValues.UnsavedChanges) :
      Main.appState.remove(AppStateValues.UnsavedChanges)
  }

  private static onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      Main.application.quit()
    }
  }

  private static async onReady(windowMinimized: boolean): Promise<BrowserWindow> {
    return await openMainWindow(windowMinimized)
  }

  //TODO ID-4

  // private static onOpenUrl(event: Electron.IpcMainEvent, url: string) {
  //   if (url.startsWith('anotherpasswordmanager://')) {
  //
  //   }
  // }

  private static async onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      await Main.onReady(false)
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
        if (Main.startupUrl) {
          window.webContents.send(IpcEventNames.App.File.OpenFromPath, Main.startupUrl)
          Main.startupUrl = null
        }
      })
    }
  }

  private static setStartupUrl(argv: string[]) {
    for (const arg of argv) {
      if (arg.startsWith('anotherpasswordmanager://') || arg.endsWith('.apm')) {
        this.startupUrl = arg
      }
    }
  }

  private static manageProtocol() {
    // TODO ID-4
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
      Main.startupUrl = path
    })
  }

  private static manageOnClose() {
    Main.mainWindow.on('close', (e) => {
      if (!Main.appState.has(AppStateValues.UnsavedChanges)) {
        return
      }

      if (Main.appState.get() === AppStateValues.Closing) {
        e.preventDefault()
        return
      } else {
        e.preventDefault()
        Main.closing()
        Main.mainWindow.webContents.send(IpcEventNames.App.State.Close)
        return
      }
    })
  }

  public static setOpenAtStartup(openAtStartup: boolean) {
    Main.application.setLoginItemSettings({
      openAtLogin: openAtStartup,
      name: 'AnotherPasswordManager'
    })
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow, powerMonitor: typeof Electron.powerMonitor) {
    Main.browserWindow = browserWindow
    Main.application = app
    Main.powerMonitor = powerMonitor
    this.startupUrl = null
    Main.manageLock()
    Main.manageOpenFile()
    Main.application.whenReady()
      .then(async () => await init(Main.application))
      .then(async () => await setShortcuts(Main.application))
      .then(async () => {
        const openMinimized = await getOpenMinimizedFromConfig()
        Main.mainWindow = await Main.onReady(openMinimized)
        if (Main.startupUrl) {
          Main.mainWindow.webContents.send(IpcEventNames.App.File.OpenFromPath, Main.startupUrl)
          Main.startupUrl = null
        }

        await applyConfig()
        Main.manageOnClose()

        //TODO ID-5

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

    //TODO ID-6
    Main.application.on('window-all-closed', Main.onWindowAllClosed)
    Main.application.on('activate', Main.onActivate)

    //TODO ID-4
    //Main.application.on('open-url', Main.onOpenUrl)

    Main.manageProtocol()
  }
}