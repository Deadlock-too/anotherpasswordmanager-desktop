import * as fs from 'fs'
import { App, BrowserWindow, nativeTheme } from 'electron'
import * as path from 'path'
import { Config, Theme, Language } from '../../../types'
import { daisyui } from '../../../../tailwind.config'
import defaultConfig from '../../../defaultConfig.json'
import Main from '../main'
import { createTray } from './trayManager'
import IpcEventNames from '../ipc/ipcEventNames'

const configFileName = 'config.json'
let configFilePath: string
let internalConfig: Config | null

export async function getThemeFromConfig(): Promise<{ currentTheme: Theme, color: string, symbolColor: 'string' }> {
  const config = internalConfig ?? await readConfig()

  const currentTheme = config.settings.appearance.useSystemTheme ?
    (nativeTheme.shouldUseDarkColors ? config.settings.appearance.darkTheme : config.settings.appearance.lightTheme)
    : config.settings.appearance.customTheme

  const theme = daisyui.themes.find(t => currentTheme in t)[currentTheme]
  const isDark = theme['color-scheme'] === 'dark'
  const color = theme['base-100']
  const symbolColor = theme['base-content'] ?? (isDark ? '#ffffff' : '#000000')
  return {
    currentTheme,
    color,
    symbolColor
  }
}

export async function getLanguageFromConfig(): Promise<Language> {
  const config = await readConfig()
  return config.settings.general.language
}

export async function getOpenMinimizedFromConfig(): Promise<boolean> {
  const config = await readConfig()
  return config.settings.general.openMinimized
}

export async function getAutoLockOnTrayFromConfig(): Promise<boolean> {
  const config = await readConfig()
  return config.settings.security.autoLockOnTray
}

export async function loadConfig(app: App) {
  configFilePath = path.join(app.getPath('userData'), configFileName)
  console.log('Config file path: ' + configFilePath)

  const config = await readConfigInternal()
  if (config) {
    console.log('Config loaded from file: ' + JSON.stringify(config))
    internalConfig = config
    return config
  } else {
    console.log('Config not found, creating a new one')
    const newConfig = await createConfig()
    if (newConfig) {
      console.log('New config created: ' + JSON.stringify(newConfig))
      internalConfig = newConfig
      return newConfig
    } else {
      console.error('Error creating a new config')
      return null
    }
  }
}

export async function applyConfig(): Promise<void> {
  const config = internalConfig ?? await readConfig()

  await applyMinimizeToTray(config.settings.general.minimizeToTray)
  await applyCloseToTray(config.settings.general.closeToTray)
  await applyAutoLockOnMinimize(config.settings.security.autoLockOnMinimize)
  await applyAutoLockOnSleep(config.settings.security.autoLockOnSleep)
  await applyAutoLockOnLock(config.settings.security.autoLockOnLock)
}

async function readConfigInternal(): Promise<Config | null> {
  let configString: string
  try {
    configString = fs.readFileSync(configFilePath, { encoding: 'utf-8' })
  } catch (err) {
    console.error('Error reading the configuration: ' + err)
    return null
  }
  let config: Config
  try {
    config = JSON.parse(configString)
  } catch (err) {
    console.error('Error parsing the configuration: ' + err)
    return null
  }
  internalConfig = config
  return config
}

export async function readConfig(): Promise<Config> {
  const config = await readConfigInternal()
  if (config)
    return config

  throw new Error('Missing config') //TODO ID-10
}

export async function createConfig(): Promise<Config | null> {
  const config: Config = {
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      general: {
        ...defaultConfig.settings.general,
        language: defaultConfig.settings.general.language as Language
      },
      appearance: {
        ...defaultConfig.settings.appearance,
        customTheme: defaultConfig.settings.appearance.customTheme as Theme,
        lightTheme: defaultConfig.settings.appearance.lightTheme as Theme,
        darkTheme: defaultConfig.settings.appearance.darkTheme as Theme
      }
    }
  }

  return await writeConfig(config)
}

export async function writeConfig(config: Config): Promise<Config | null> {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config))
    return config
  } catch (err) {
    console.error(err)
    return null
  }
}

/**
 * Apply config to the app
 */
export const handleMinimizeToTray = async (e) => {
  e.preventDefault()
  Main.mainWindow.hide()

  await createTray()
}

export async function applyMinimizeToTray(minimizeToTray: boolean) {
  Main.mainWindow.removeListener('minimize', handleMinimizeToTray)

  if (minimizeToTray) {
    Main.mainWindow.on('minimize', handleMinimizeToTray)
  }
}

export const handleCloseToTray = async (e) => {
  if (!Main.Tray) {
    e.preventDefault()
    Main.mainWindow.hide()

    await createTray()
  }
}

export async function applyCloseToTray(closeToTray: boolean) {
  Main.mainWindow.removeListener('close', handleCloseToTray)

  if (closeToTray) {
    Main.mainWindow.on('close', handleCloseToTray)
  }
}

export const handleLock = async () => {
  BrowserWindow.getAllWindows().forEach((window) => {
    window.webContents.send(IpcEventNames.Electron.Lock)
  })
}

export async function applyAutoLockOnMinimize(autoLockOnMinimize: boolean) {
  Main.mainWindow.removeListener('minimize', handleLock)

  if (autoLockOnMinimize) {
    Main.mainWindow.on('minimize', handleLock)
  }
}

export async function applyAutoLockOnSleep(autoLockOnSleep: boolean) {
  Main.PowerMonitor.removeListener('suspend', handleLock)

  if (autoLockOnSleep) {
    Main.PowerMonitor.on('suspend', handleLock)
  }
}

export async function applyAutoLockOnLock(autoLockOnLock: boolean) {
  Main.PowerMonitor.removeListener('lock-screen', handleLock)

  if (autoLockOnLock) {
    Main.PowerMonitor.on('lock-screen', handleLock)
  }
}