import i18next, { TOptions, changeLanguage as changeLang, init, t } from 'i18next'
import translations from './translations'

const DEFAULT_LANGUAGE = 'en'

export async function changeLanguage(lang: string) {
    await changeLang(lang)
}

export async function initialize(lang: string) {
    await init({
        lng: lang,
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
}

export function onLanguageChanged(callback: (lang: string) => void): () => void {
    const cb = (lang: string) => callback(lang)
    i18next.on('languageChanged', cb)
    return () => {
        i18next.off('languageChanged', cb)
    }
}

export function l(key: string, options?: TOptions): string {
    return t(key, options)
}