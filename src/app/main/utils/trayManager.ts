import { BrowserWindow, Menu, Tray } from 'electron'
import Main from '../main'
import Pkg from '../../../../package.json'
import * as path from 'path'
import i18n from '../../../i18n'
import IpcEventNames from '../ipc/ipcEventNames'
import { getAutoLockOnTrayFromConfig } from './configManager'


export const createTray = async () => {
  if (Main.tray)
    return

  await getAutoLockOnTrayFromConfig().then(autoLockOnTray => {
    if (autoLockOnTray) {
      BrowserWindow.getAllWindows().forEach(window => {
        window.webContents.send(IpcEventNames.App.State.Lock)
      })
    }
  })

  Main.tray = new Tray(path.join(__dirname, 'assets', 'icons', 'icon.png'))

  Main.tray.setToolTip(Pkg.description)
  Main.tray.setTitle(Pkg.description)

  Main.tray.on('double-click', () => {
    destroyTray()
  })

  Main.tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: i18n.default.t('Show App'), click: () => {
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

  return Main.tray
}

export const destroyTray = () => {
  Main.mainWindow.show()
  Main.removeFromTray()
  Main.tray?.destroy()
  Main.tray = undefined
}