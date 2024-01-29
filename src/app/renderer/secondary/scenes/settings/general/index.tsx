import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { FormikCheckbox, FormikDropdown } from '../../../../common/components'
import { Language } from '../../../../../../types'

const GeneralSettings = ({ formik }) => {
  const languages = Object.entries(Language).map(([ key, value ]) => ({ label: key, value }))
  return (
    <SettingSection title="General">
      <Setting title="Language">
        <SettingRow>
          <FormikDropdown
            name="generalLanguage"
            label="Language"
            options={ languages }
            disabled={ false }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title="Open">
        <SettingRow>
          <FormikCheckbox
            field="generalOpenAtStartup"
            label="Open at startup"
            formik={ formik }
          />
          <FormikCheckbox
            field="generalOpenMinimized"
            label="Open minimized"
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title="Tray">
        <SettingRow>
          <FormikCheckbox
            field="generalMinimizeToTray"
            label="Minimize to tray"
            formik={ formik }
          />
          <FormikCheckbox
            field="generalCloseToTray"
            label="Close to tray"
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title="Auto-save">
        <SettingRow>
          <FormikCheckbox
            field="generalAutoSave"
            label="Auto-save edits"
            formik={ formik }
          />
        </SettingRow>
      </Setting>
    </SettingSection>
  )
}

export default GeneralSettings