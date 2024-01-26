import { ReactNode, useEffect, useRef, useState } from 'react'
import { useConfigContext, useThemeContext } from '../../../main/contexts'
import { Formik } from 'formik'
import AppearanceSettings from './appearance'
import GeneralSettings from './general'
import SecuritySettings from './security'
import { Config } from '../../../../../types'

enum SettingSections {
  General = 'General',
  Appearance = 'Appearance',
  Security = 'Security',
}

/* Move these three functions to a helper */
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function configToInitialValues(config: Config) {
  const initialValues = {}

  for (const section in config.settings) {
    for (const setting in config.settings[section]) {
      initialValues[section + capitalizeFirstLetter(setting)] = config.settings[section][setting]
    }
  }

  return initialValues
}

function valuesToConfig(values: any, currentConfig: Config) {
  const newConfig : Config = { ...currentConfig }

  for (const section in currentConfig.settings) {
    for (const setting in currentConfig.settings[section]) {
      newConfig.settings[section][setting] = values[section + capitalizeFirstLetter(setting)]
    }
  }

  return newConfig
}

const SettingsScene = () => {
  const [ selectedSetting, setSelectedSetting ] = useState<SettingSections>(SettingSections.General)

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

  return (
    <Formik
      initialValues={ initialValues }
      validate={ () => {
        /* TODO */
      } }
      onSubmit={ async (values, { setSubmitting }) => {
        setTimeout(() => {
          const newValues = valuesToConfig(values, config)
          handleUpdateConfig({
            ...config,
            settings: newValues.settings,
          }).then(async () => {
            if (newValues.settings.appearance.useSystemTheme) {
              await window.theming.setSystem()
            }
            return await window.theming.isDark()
          })
            .then(isDark => {
              if (newValues.settings.appearance.useSystemTheme) {
                if (isDark) {
                  window.theming.setTheme(newValues.settings.appearance.darkTheme, true)
                } else {
                  window.theming.setTheme(newValues.settings.appearance.lightTheme, true)
                }
              } else {
                window.theming.setTheme(newValues.settings.appearance.customTheme, false)
              }
            })
            .then(() => window.localization.changeLanguage(newValues.settings.general.language))
            .then(() => setSubmitting(false))
            .then(() => window.close())
        }, 50)
      } }
      onReset={ () => {
        //TODO RESET NOT ONLY THEME EDITS
        (async () => {
          if (config.settings.appearance.useSystemTheme) {
            await window.theming.setSystem()
          }
          return await window.theming.isDark()
        })()
          .then(isDark => {
            setTemporaryUseSystemTheme(undefined)
            setTemporaryLightTheme(undefined)
            setTemporaryDarkTheme(undefined)

            if (config.settings.appearance.useSystemTheme) {
              if (isDark) {
                window.theming.setTheme(config.settings.appearance.darkTheme, true)
              } else {
                window.theming.setTheme(config.settings.appearance.lightTheme, true)
              }
            } else {
              window.theming.setTheme(config.settings.appearance.customTheme, false)
            }

            window.localization.changeLanguage(config.settings.general.language)
          })
          .then(() => window.close())
      } }
    >
      {
        (formik) => (
          <form onSubmit={ formik.handleSubmit } onReset={ formik.handleReset }
                className="flex flex-col h-full w-full gap-2">
            <div className="flex flex-row h-full w-full gap-2">
              <div className="w-3/12 h-full flex flex-col unselectable">
                <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
                  <div className="scrollbar">
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
                                  { setting }
                                </div>
                              </a>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div>
              <div className="w-9/12 h-full flex flex-col unselectable">
                <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
                  <div className="scrollbar">
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
                  </div>
                </div>
              </div>
            </div>
            <div className="divider -mt-2 -mb-2"/>
            <div className="flex flex-row justify-end items-center gap-2">
              <button type="submit" className="btn btn-primary btn-sm w-16">OK</button>
              <button type="reset" className="btn btn-neutral btn-sm w-16">Cancel</button>
              <button type="button" className="btn btn-neutral btn-sm w-16" onClick={ () => {
                //TODO APPLY OTHER SETTINGS TOO IF POSSIBLE
                (async () => {
                  if (formik.values['appearanceUseSystemTheme']) {
                    await window.theming.setSystem()
                  }
                  return await window.theming.isDark()
                })()
                  .then(isDark => {
                    setTemporaryUseSystemTheme(formik.values['appearanceUseSystemTheme'])
                    setTemporaryLightTheme(formik.values['appearanceLightTheme'])
                    setTemporaryDarkTheme(formik.values['appearanceDarkTheme'])

                    if (formik.values['appearanceUseSystemTheme']) {
                      if (isDark) {
                        window.theming.setTheme(formik.values['appearanceDarkTheme'], true)
                      } else {
                        window.theming.setTheme(formik.values['appearanceLightTheme'], true)
                      }
                    } else {
                      window.theming.setTheme(formik.values['appearanceCustomTheme'], false)
                    }
                    window.localization.changeLanguage(formik.values['generalLanguage'])
                  })
              } }
              >Apply
              </button>
            </div>
          </form>
        )
      }
    </Formik>
  )
}

export default SettingsScene