import { globalShortcut, App } from 'electron'

export async function setShortcuts(app: App) {
  if (!app.isPackaged) return // Don't remove shortcuts in dev mode

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const doNothing = () => {}

  // Register on focus
  app.on('browser-window-focus', () => {
    /** Register shortcuts to prevent refresh **/
    globalShortcut.register('CommandOrControl+R', doNothing)
    globalShortcut.register('CommandOrControl+Shift+R', doNothing)
    globalShortcut.register('F5', doNothing)
  })

  // Unregister on blur
  app.on('browser-window-blur', () => {
    /** Unregister shortcuts that prevent refresh **/
    globalShortcut.unregister('CommandOrControl+R')
    globalShortcut.unregister('CommandOrControl+Shift+R')
    globalShortcut.unregister('F5')
  })
}