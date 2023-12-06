import { initialize as initializeLocalization, onLanguageChanged } from '../utils/i18n/localization'
import setAppMenu from '../utils/appMenu'

export async function init() {
  // Localization
  await initializeLocalization('it')
  onLanguageChanged((lang: string) => {
    console.log('Language changed to: ' + lang)
  })

  // App Menu
  setAppMenu()
}