import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './translations'

const DEFAULT_LANGUAGE = 'en'

i18n
  .use(initReactI18next)
  .init({
    lng: DEFAULT_LANGUAGE,
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

export function changeLanguage (lang: string) {
  i18n.changeLanguage(lang)
}

export default i18n