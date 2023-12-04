import { BrowserWindow, ipcMain, nativeTheme } from 'electron';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

async function manageDarkMode() {
    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
    })
}

async function createMainWindow() {
    function onClose() {
        // Dereference the window object.
        mainWindow = null
    }

    let mainWindow : BrowserWindow | null = new BrowserWindow({
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        },
        height: 600,
        width: 800,
    })

    await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
    mainWindow.on('closed', onClose)

    //mainWindow.webContents.openDevTools()

    await manageDarkMode()
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