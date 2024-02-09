import setAppMenu from '../utils/appMenu'
import { loadConfig } from '../utils/configManager'
import { App } from 'electron'

export async function init(app: App) {
  await loadConfig(app)

  setAppMenu() //TODO ID-12
}