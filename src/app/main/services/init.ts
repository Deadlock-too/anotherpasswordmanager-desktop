// import { initialize as initializeLocalization, onLanguageChanged } from '../../../i18n/localization'
import setAppMenu from '../utils/appMenu'
import { loadConfig } from '../utils/configManager'
import { App } from 'electron'

export async function init(app: App) {
  // /** Localization **/ /* TODO USE LIBRARIES LIKE OS-LOCALE TO DETERMINE CURRENT OS LANGUAGE WHEN FIRST ACCESSED THEN SAVE IT FOR FURTHER RE-USE */
  // await initializeLocalization('it')
  // onLanguageChanged((lang: string) => {
  //   console.log('Language changed to: ' + lang)
  // })

  await loadConfig(app)

  // App Menu
  setAppMenu()
}