import { BrowserWindow, Menu, Tray } from 'electron'
import Main from '../main'
import Pkg from '../../../../package.json'
import * as path from 'path'
import i18n from '../../../i18n'
import IpcEventNames from '../ipc/ipcEventNames'
import { getAutoLockOnTrayFromConfig } from './configManager'


export const createTray = async () => {
  if (Main.Tray)
    return

  await getAutoLockOnTrayFromConfig().then(autoLockOnTray => {
    if (autoLockOnTray) {
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send(IpcEventNames.App.Lock)
      })
    }
  })

  Main.Tray = new Tray(path.join(__dirname, 'assets', 'icons', 'icon.png'))

  Main.Tray.setToolTip(Pkg.description)
  Main.Tray.setTitle(Pkg.description)

  Main.Tray.on('double-click', () => {
    Main.mainWindow.show()
    destroyTray()
  })

  Main.Tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: i18n.default.t('Show App'), click: () => {
        Main.mainWindow.show()
        destroyTray()
      }
    },
    {
      type: 'separator'
    },
    {
      label: i18n.default.t('Quit'), click: () => {
        Main.application.quit()
      }
    }
  ]))

  return Main.Tray
}

export const destroyTray = () => {
  Main.Tray?.destroy()
  Main.Tray = undefined
}