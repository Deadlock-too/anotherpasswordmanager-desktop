import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { FormikCheckbox, FormikDropdown } from '../../../../common/components'
import { Language } from '../../../../../../types'
import { useTranslation } from 'react-i18next'

const GeneralSettings = ({ formik }) => {
  const { t } = useTranslation()
  const languages = Object.entries(Language).map(([ , value ]) => ({
    label: t(`SettingsDialog.General.Language.Values.${ value }`),
    value
  }))
  return (
    <SettingSection title={ t('SettingsDialog.General.Title') }>
      <Setting title={ t('SettingsDialog.General.Language.Title') }>
        <SettingRow>
          <FormikDropdown
            name="generalLanguage"
            label={ t('SettingsDialog.General.Language.Label') }
            options={ languages }
            disabled={ false }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.General.Open.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="generalOpenAtStartup"
            label={ t('SettingsDialog.General.Open.Open at startup') }
            formik={ formik }
          />
          <FormikCheckbox
            field="generalOpenMinimized"
            label={ t('SettingsDialog.General.Open.Open minimized') }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.General.Tray.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="generalMinimizeToTray"
            label={ t('SettingsDialog.General.Tray.Minimize to tray') }
            formik={ formik }
          />
          <FormikCheckbox
            field="generalCloseToTray"
            label={ t('SettingsDialog.General.Tray.Close to tray') }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.General.Auto-save.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="generalAutoSave"
            label={ t('SettingsDialog.General.Auto-save.Auto-save edits') }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
    </SettingSection>
  )
}

export default GeneralSettings