import { app, BrowserWindow } from 'electron'
import Main from './app/main/main'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

Main.main(app, BrowserWindow)