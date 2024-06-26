import * as i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './translations'
import { DEFAULT_LANGUAGE } from '../consts'

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    debug: false,
    resources: Object.keys(translations).reduce(
      (output, lang) => ({
        ...output,
        [lang]: {
          translation: translations[lang]
        }
      }),
      {}
    )
  })

export default i18n