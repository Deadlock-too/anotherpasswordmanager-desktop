import * as fs from 'fs'
import { App, nativeTheme } from 'electron'
import * as path from 'path'
import { Config, Theme } from '../../../types'
import i18n from '../../../i18n'
import { daisyui } from '../../../../tailwind.config'

const configFileName = 'config.json'
let configFilePath: string
let internalConfig: Config | null

export async function getThemeFromConfig(): Promise<{ currentTheme: Theme, color: string, symbolColor: 'string' }> {
  const config = internalConfig ?? await readConfig()

  const currentTheme = config.appearance.useSystemTheme ?
    (nativeTheme.shouldUseDarkColors ? config.appearance.darkTheme : config.appearance.lightTheme)
    : config.appearance.customTheme

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
    }
    else {
      console.error('Error creating a new config')
      return null
    }
  }
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

  throw new Error('Missing config') //TODO IMPROVE
}

export async function createConfig(): Promise<Config | null> {
  // TODO write default config in a json file to make it easier to edit and update
  const config: Config = {
    language: i18n.default.language,
    appearance: {
      customTheme: Theme.dark,
      darkTheme: Theme.dark,
      lightTheme: Theme.light,
      useSystemTheme: true
    },
    lastOpenedFiles: [],
    settings: {
      // security: {
      //   autoLock: false,
      //   autoLockTime: undefined,
      //   autoLockOnMinimize: false,
      //   autoCleanClipboard: false,
      //   autoCleanClipboardTime: undefined,
      //   defaultNewPasswordExpire: false,
      //   defaultNewPasswordExpireTime: undefined
      // },
      openAtStartup: false,
      autoSave: false,
      autoSaveTime: undefined
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
