import { ReactNode, useEffect, useRef, useState } from 'react'
import { useConfigContext, useThemeContext } from '../../../common/contexts'
import { Formik } from 'formik'
import AppearanceSettings from './appearance'
import GeneralSettings from './general'
import SecuritySettings from './security'
import { configToInitialValues, valuesToConfig } from '../../../../../utils'
import { Language, Theme } from '../../../../../types'
import { useTranslation } from 'react-i18next'
import i18n from '../../../../../i18n'
import { ScrollableDiv } from '../../../common/components'

enum SettingSections {
  General = 'General',
  Appearance = 'Appearance',
  Security = 'Security'
}

const SettingsScene = ({formikRef}) => {
  const [ selectedSetting, setSelectedSetting ] = useState<SettingSections>(SettingSections.General)
  const { t } = useTranslation()
  const settings = Object.values(SettingSections)

  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const liRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    textRefs.current = textRefs.current.slice(0, settings.length)
    liRefs.current = liRefs.current.slice(0, settings.length)

    settings.forEach((_, i) => {
      if (!textRefs.current[i]) {
        textRefs.current[i] = null
      }
      if (!liRefs.current[i]) {
        liRefs.current[i] = null
      }
    })

    settings.forEach((_, i) => {
      const textElement = textRefs.current[i]
      const liElement = liRefs.current[i]
      if (textElement && liElement) {
        liElement.addEventListener('mouseenter', () => {
          const scrollAmount = (textElement.scrollWidth - textElement.offsetWidth)
          if (scrollAmount <= 0) return
          const scrollTime = scrollAmount / 2
          textElement.style.setProperty('--scroll-amount', `-${ scrollAmount }px`)
          textElement.style.setProperty('--scroll-time', `${ scrollTime }s`)
          textElement.classList.add('truncate-scroll')
        })

        liElement.addEventListener('mouseleave', () => textElement.classList.remove('truncate-scroll'))
      }
    })
  })

  const { config, handleUpdateConfig } = useConfigContext()
  const { setTemporaryDarkTheme, setTemporaryLightTheme, setTemporaryUseSystemTheme } = useThemeContext()

  const initialValues = configToInitialValues(config)

  const handleApplySettings = async (values: {
    useSystemTheme: boolean,
    darkTheme: Theme,
    lightTheme: Theme,
    customTheme: Theme,
    language: Language
  }, setTemporaryValues: boolean) => {
    //TODO APPLY OTHER SETTINGS TOO IF POSSIBLE
    await (async () => {
      await window.localization.changeLanguage(values.language)

      if (values.useSystemTheme) {
        await window.theming.setSystem()
      }

      const isDark = await window.theming.isDark()

      setTemporaryUseSystemTheme(setTemporaryValues ? values.useSystemTheme : undefined)
      setTemporaryLightTheme(setTemporaryValues ? values.lightTheme : undefined)
      setTemporaryDarkTheme(setTemporaryValues ? values.darkTheme : undefined)

      if (values.useSystemTheme) {
        if (isDark) {
          await window.theming.setTheme(values.darkTheme, true)
        } else {
          await window.theming.setTheme(values.lightTheme, true)
        }
      } else {
        await window.theming.setTheme(values.customTheme, false)
      }
    })()
      .then(async () => await i18n.changeLanguage(values.language))
  }

  const handleSubmit = (values: any, { setSubmitting }) => {
    const newValues = valuesToConfig(values, config);

    (async () => {
      await handleApplySettings({
        ...newValues.settings.appearance,
        language: newValues.settings.general.language
      }, false)
    })()
      .then(() => handleUpdateConfig({
        ...config,
        settings: newValues.settings,
      }))
      .then(() => setSubmitting(false))
      .then(() => window.close())
  }

  const handleReset = () => {
    //TODO RESET NOT ONLY THEME EDITS
    (async () => {
      await handleApplySettings({
        useSystemTheme: config.settings.appearance.useSystemTheme,
        darkTheme: config.settings.appearance.darkTheme,
        lightTheme: config.settings.appearance.lightTheme,
        customTheme: config.settings.appearance.customTheme,
        language: config.settings.general.language,
      }, false)
    })()
      .then(() => window.close())
  }

  return (
    <Formik
      initialValues={ initialValues }
      onSubmit={ handleSubmit }
      onReset={ handleReset }
      innerRef={formikRef}
    >
      {
        (formik) => (
          <form onSubmit={ formik.handleSubmit } onReset={ formik.handleReset }
                className="flex flex-col h-full w-full gap-2">
            <div className="flex flex-row h-full w-full gap-2 overflow-hidden">
              <div className="w-3/12 h-full flex flex-col unselectable">
                <ScrollableDiv height="max-h-full">
                  <ul className="menu menu-md bg-base-300 w-full rounded-md gap-1">
                    {
                      settings.map((setting, i) => {
                        const isSelected = selectedSetting === setting
                        return (
                          <li key={ setting } className={ isSelected ? 'selected' : '' }
                              ref={ el => liRefs.current[i] = el }
                          >
                            <a key={ setting } onClick={ () => setSelectedSetting(setting) }
                               className="justify-between items-center">
                              <div className="flex-grow truncate" ref={ el => textRefs.current[i] = el }>
                                { t(`SettingsDialog.${ setting }.Title`) }
                              </div>
                            </a>
                          </li>
                        )
                      })
                    }
                  </ul>
                </ScrollableDiv>
              </div>
              <div className="w-9/12 h-full flex flex-col unselectable">
                <ScrollableDiv height="max-h-full">
                  {
                    ((selectedSetting) => {
                      let component: Element | ReactNode
                      switch (selectedSetting) {
                        case SettingSections.General:
                          component = <GeneralSettings formik={ formik }/>
                          break
                        case SettingSections.Appearance:
                          component = <AppearanceSettings formik={ formik }/>
                          break
                        case SettingSections.Security:
                          component = <SecuritySettings formik={ formik }/>
                          break
                        default:
                          component = <div>Unknown setting</div>
                          break
                      }
                      return component
                    })(selectedSetting)
                  }
                </ScrollableDiv>
              </div>
            </div>
            <div className="divider -mt-2 -mb-2"/>
            <div className="flex flex-row justify-end items-center gap-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-16">
                { t('SettingsDialog.Submit Button') }
              </button>
              <button
                type="reset"
                className="btn btn-neutral btn-sm w-16">
                { t('SettingsDialog.Cancel Button') }
              </button>
              <button
                type="button"
                className="btn btn-neutral btn-sm w-16"
                onClick={ async () => {
                  await handleApplySettings({
                    useSystemTheme: formik.values['appearanceUseSystemTheme'],
                    darkTheme: formik.values['appearanceDarkTheme'],
                    lightTheme: formik.values['appearanceLightTheme'],
                    customTheme: formik.values['appearanceCustomTheme'],
                    language: formik.values['generalLanguage'],
                  }, true)
                } }
              >
                { t('SettingsDialog.Apply Button') }
              </button>
            </div>
          </form>
        )
      }
    </Formik>
  )
}

export default SettingsScene