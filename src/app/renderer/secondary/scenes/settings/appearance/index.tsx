import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { SettingsIcon } from '../../../../../../assets/icons'
import { FormikDropdown, FormikToggle, ScrollableDiv } from '../../../../common/components'
import { Theme } from '../../../../../../types'
import { daisyui } from '../../../../../../../tailwind.config'
import { useTranslation } from 'react-i18next'

//TODO ID-19
const AppearanceSettings = ({ formik }) => {
  const { t } = useTranslation()
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
    <SettingSection title={ t('SettingsDialog.Appearance.Title') }>
      <Setting title={ t('SettingsDialog.Appearance.Theme.Title') }>
        <SettingRow>
          <FormikDropdown
            field="appearanceCustomTheme"
            label={ t('SettingsDialog.Appearance.Theme.Label') }
            options={ themeOptions }
            formik={ formik }
            disabled={ formik.values.appearanceUseSystemTheme }
          />
        </SettingRow>
        <SettingRow>
          <FormikToggle
            name="appearanceUseSystemTheme"
            label={ t('SettingsDialog.Appearance.Theme.Sync with OS') }
            formik={ formik }
          />
          {
            formik.values.appearanceUseSystemTheme ?
              <details className="dropdown dropdown-bottom dropdown-end">
                <summary tabIndex={ formik.values.appearanceUseSystemTheme ? 0 : -1 }
                         className="m-1 btn btn-sm btn-outline">
                  <SettingsIcon/>
                </summary>
                <ul tabIndex={ 0 } className="shadow menu z-[1] dropdown-content bg-base-100 rounded-md w-44">
                  <ScrollableDiv height='max-h-52'>
                    <li className="menu-title font-extrabold">{ t('SettingsDialog.Appearance.Theme.Preferences') }</li>
                    <li className="menu-title">{ t('SettingsDialog.Appearance.Theme.Light') }</li>
                    {
                      lightThemes.map((thm) => (
                        <li key={ thm }
                            className={ formik.values.appearanceLightTheme === thm ? 'selected-setting' : '' }>
                          <a onClick={ () => formik.setFieldValue('appearanceLightTheme', thm) }>{ thm }</a>
                        </li>
                      ))
                    }
                    <div className="divider"></div>
                    <li className="menu-title">{ t('SettingsDialog.Appearance.Theme.Dark') }</li>
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