import * as fs from 'fs'
import { App } from 'electron'
import * as path from 'path'
import { Config, Theme } from '../../../types'
import i18n from '../../../i18n'

const configFileName = 'config.json'

export async function loadConfig(app: App) {
  const configFilePath = path.join(app.getPath('userData'), configFileName)
  console.log('Config file path: ' + configFilePath)

  const config = await readConfig(configFilePath)
  if (config) {
    console.log('Config loaded from file: ' + JSON.stringify(config))
    return config
  } else {
    console.log('Config not found, creating a new one')
    const newConfig = await createConfig(configFilePath)
    console.log('New config created: ' + JSON.stringify(newConfig))
    return newConfig
  }
}

export async function readConfig(path: string): Promise<Config | null> {
  let configString: string
  try {
    configString = fs.readFileSync(path, { encoding: 'utf-8' })
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
  return config
}

export async function createConfig(path: string): Promise<Config | null> {
  // TODO write default config in a json file to make it easier to edit and update
  const config: Config = {
    language: i18n.default.language,
    theme: Theme.system,
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

  return await writeConfig(config, path)
}

export async function writeConfig(config: Config, path: string): Promise<Config | null> {
  try {
    fs.writeFileSync(path, JSON.stringify(config))
    return config
  } catch (err) {
    console.error(err)
    return null
  }
}
