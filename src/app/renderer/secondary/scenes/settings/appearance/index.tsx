import { Setting, SettingRow, SettingSection } from "../../../components/settings"
import { SettingsIcon } from '../../../../../../assets/icons'
import { FormikDropdown, FormikToggle, ScrollableDiv } from '../../../../common/components'
import { Theme } from '../../../../../../types'
import { daisyui } from '../../../../../../../tailwind.config'

/* TODO MANAGE IMMEDIATE UPDATE OF THEME AND NOT ONLY ON APPLY OR SUBMIT */
const AppearanceSettings = ({ formik }) => {
  const themes = Object.values(Theme).filter(thm => thm != Theme.system)
  const lightThemes: Theme[] = []
  const darkThemes: Theme[] = []

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

  const themeOptions = themes.map(theme => ({ label: theme, value: theme }))

  return (
    <SettingSection title="Appearance">
      <Setting title="Theme">
        <SettingRow>
          <FormikDropdown
            name="appearanceCustomTheme"
            label="Theme"
            options={ themeOptions }
            formik={ formik }
            disabled={ formik.values.appearanceUseSystemTheme }
          />
          <FormikToggle
            name="appearanceUseSystemTheme"
            label="Sync with OS"
            formik={ formik }
          />
          {
            //TODO CREATE COMPONENT
            formik.values.appearanceUseSystemTheme ?
              <details className="dropdown dropdown-bottom dropdown-end">
                <summary tabIndex={ formik.values.appearanceUseSystemTheme ? 0 : -1 }
                         className="m-1 btn btn-sm btn-outline">
                  <SettingsIcon/>
                </summary>
                <ul tabIndex={ 0 } className="shadow menu z-[1] dropdown-content bg-base-100 rounded-md w-44">
                  <ScrollableDiv>
                    <li className="menu-title font-extrabold">Preferences</li>
                    <li className="menu-title">Light</li>
                    {
                      lightThemes.map((thm) => (
                        <li key={ thm }
                            className={ formik.values.appearanceLightTheme === thm ? 'selected-setting' : '' }>
                          <a onClick={ () => formik.setFieldValue('appearanceLightTheme', thm) }>{ thm }</a>
                        </li>
                      ))
                    }
                    <div className="divider"></div>
                    <li className="menu-title">Dark</li>
                    {
                      darkThemes.map((thm) => (
                        <li key={ thm }
                            className={ formik.values.appearanceDarkTheme === thm ? 'selected-setting' : '' }>
                          <a onClick={ () => formik.setFieldValue('appearanceDarkTheme', thm) }>{ thm }</a>
                        </li>
                      ))
                    }
                  </ScrollableDiv>
                </ul>
              </details>
              : null
          }
        </SettingRow>
      </Setting>
    </SettingSection>
  )
}

export default AppearanceSettings