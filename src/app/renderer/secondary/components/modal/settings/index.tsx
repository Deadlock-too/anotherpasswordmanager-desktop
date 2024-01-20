import { useEffect, useRef, useState } from 'react'
import { Theme } from '../../../../../../types'
import { SettingsIcon } from '../../../../../../assets/icons'
import { daisyui } from '../../../../../../../tailwind.config'
import { useConfigContext } from '../../../../main/contexts'

enum Settings {
  General = 'General',
  Appearance = 'Appearance',
  Security = 'Security',
  // Sync = 'Sync',
  // About = 'About',
  // Advanced = 'Advanced',
  // Experimental = 'Experimental'
}

const AppearanceSettings = ({config}) => {
  const [ theme, setTheme ] = useState<Theme>(config.appearance.theme)
  const [ previousTheme, setPreviousTheme ] = useState<Theme>(config.appearance.previousTheme)
  const [ lightTheme, setLightTheme ] = useState<Theme>(config.appearance.lightTheme)
  const [ darkTheme, setDarkTheme ] = useState<Theme>(config.appearance.darkTheme)
  const [ useSystemTheme, setUseSystemTheme ] = useState<boolean>(config.appearance.useSystemTheme)

  //TODO: Fix this
  const [ isDarkTheme, setIsDarkTheme ] = useState<boolean>(true)

  /*
  const { config } = useConfigContext()
  if (config) {
    setTheme(config.appearance.theme)
    setPreviousTheme(config.appearance.previousTheme)
    setLightTheme(config.appearance.lightTheme)
    setDarkTheme(config.appearance.darkTheme)
    setUseSystemTheme(config.appearance.useSystemTheme)
    setIsDarkTheme(window.theming.darkMode.isDark())
  }
  */

  const themes = Object.values(Theme).filter(thm => thm != Theme.system)
  let lightThemes: Theme[] = []
  let darkThemes: Theme[] = []

  for (const theme of themes) {
    const thm = daisyui.themes.find(thm => theme in thm)
    if (thm[theme]['color-scheme'] === 'light') {
      lightThemes.push(theme)
    } else if (thm[theme]['color-scheme'] === 'dark') {
      darkThemes.push(theme)
    } else {
      throw new Error(`Theme ${ theme } does not have a color-scheme`)
    }
  }

  const dropdownRef = useRef<HTMLDetailsElement>(null)

  return (
    <div className="flex flex-col h-full px-5 py-2">
      <span className="text-lg font-bold">Appearance</span>
      <div className="flex flex-row justify-start items-center gap-5">
        <div className="form-control w-52">
          <label className="label">
            <span className="label-text">Theme:</span>
            {
              useSystemTheme ?
                <button tabIndex={ 0 } className="m-1 btn btn-sm btn-outline w-32" disabled={ true }>
                  { window.theming.darkMode.isDark() ? darkTheme : lightTheme }
                </button>
                :
                <details className="dropdown" ref={ dropdownRef }>
                  <summary tabIndex={ 0 } className="m-1 btn btn-sm btn-outline w-32">
                    { theme }
                  </summary>
                  <ul tabIndex={ 0 } className="shadow menu z-[1] dropdown-content bg-base-100 rounded-md w-44">
                    <div className="bg-base-200 w-full flex-grow h-72 rounded p-2 scrollbar-wrapper">
                      <div className="scrollbar pr-2">
                        {
                          themes.map((thm) => (
                            <li key={ thm } className={ theme === thm ? 'selected-setting' : '' }>
                              <a onClick={ () => {
                                setTheme(thm)
                                dropdownRef.current?.removeAttribute('open')
                              } }>{ thm }</a>
                            </li>
                          ))
                        }
                      </div>
                    </div>
                  </ul>
                </details>
            }
          </label>
        </div>
        <div className="form-control w-52">
          <label className="label"
                 /* TODO FIX (when clicking the label the value does not get toggled) */
                 onClick={ () => {
                   setUseSystemTheme(prev => !prev)

                   setTheme(prevState => {
                     if (prevState === Theme.system) {
                       return previousTheme
                     } else {
                       setPreviousTheme(prevState)
                       return Theme.system
                     }
                   })
                 } }
          >
            <span className="label-text">Sync with OS:</span>
            <input type="checkbox" className="toggle toggle-sm" checked={ useSystemTheme }/>
          </label>
        </div>
        {
          useSystemTheme ?
            <details className="dropdown dropdown-bottom dropdown-end">
              <summary tabIndex={ useSystemTheme ? 0 : -1 } className="m-1 btn btn-sm btn-outline">
                <SettingsIcon/>
              </summary>
              <ul tabIndex={ 0 } className="shadow menu z-[1] dropdown-content bg-base-100 rounded-md w-44">
                <div className="bg-base-200 w-full flex-grow h-72 rounded p-2 scrollbar-wrapper">
                  <div className="scrollbar pr-2">
                    <li className="menu-title font-extrabold">Preferences</li>
                    <li className="menu-title">Light</li>
                    {
                      lightThemes.map((thm) => (
                        <li key={ thm } className={ lightTheme === thm ? 'selected-setting' : '' }>
                          <a onClick={ () => {
                            setLightTheme(thm)
                          } }>{ thm }</a>
                        </li>
                      ))
                    }
                    <div className="divider"></div>
                    <li className="menu-title">Dark</li>
                    {
                      darkThemes.map((thm) => (
                        <li key={ thm } className={ darkTheme === thm ? 'selected-setting' : '' }>
                          <a onClick={ () => {
                            setDarkTheme(thm)
                          } }>{ thm }</a>
                        </li>
                      ))
                    }
                  </div>
                </div>
              </ul>
            </details>
            : null
        }
      </div>
    </div>
  )
}

const GeneralSettings = () => {
  return (
    <div>
      General Settings
    </div>
  )
}

const SecuritySettings = () => {
  return (
    <div>
      Security Settings
    </div>
  )
}

const SettingsModal = ({config}) => {
  const [ selectedSetting, setSelectedSetting ] = useState<Settings>(Settings.Appearance)

  const settings = Object.values(Settings)

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
          let scrollAmount = (textElement.scrollWidth - textElement.offsetWidth)
          if (scrollAmount <= 0) return
          /**
           * Increase scroll amount to prevent text from being cut off by the buttons
           * Increased by 24px (icon width) * 2 (number of icons)
           **/
          const scrollTime = scrollAmount / 2
          textElement.style.setProperty('--scroll-amount', `-${ scrollAmount }px`)
          textElement.style.setProperty('--scroll-time', `${ scrollTime }s`)
          textElement.classList.add('truncate-scroll')
        })

        liElement.addEventListener('mouseleave', () => textElement.classList.remove('truncate-scroll'))
      }
    })
  })

  let detailComponent
  switch (selectedSetting) {
    case Settings.General:
      detailComponent = <GeneralSettings/>
      break
    case Settings.Appearance:
      detailComponent = <AppearanceSettings config={config}/>
      break
    case Settings.Security:
      detailComponent = <SecuritySettings/>
      break
    default:
      detailComponent = <div>Unknown setting</div>
  }

  return (
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
              // <h1 className="text-center font-bold">
              //   { selectedSetting }
              // </h1>
              detailComponent
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal