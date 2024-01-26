import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { FormikCheckbox, FormikNumberInput } from '../../../../common/components'

const SecuritySettings = ({ formik }) => {
  return (
    <SettingSection title="Security">
      <Setting title="Auto lock">
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLock"
            label="Timed auto lock"
            formik={ formik }
          />
          <FormikNumberInput
            preLabel="Auto lock after"
            afterLabel="seconds"
            field="securityAutoLockTime"
            disabled={ !formik.values.securityAutoLock }
            formik={ formik }
          />
        </SettingRow>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLockOnMinimize"
            label="On minimize"
            formik={ formik }
          />
          <FormikCheckbox
            field="securityAutoLockOnSleep"
            label="On sleep"
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title="Clipboard">
        <SettingRow>
          <FormikCheckbox
            field="securityAutoCleanClipboard"
            label="Auto clear clipboard"
            formik={ formik }
          />
          <FormikNumberInput
            preLabel="Clear after"
            afterLabel="seconds"
            field="securityAutoCleanClipboardTime"
            disabled={ !formik.values.securityAutoCleanClipboard }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title="Entry expire">
        <SettingRow>
          <FormikCheckbox
            field="securityDefaultNewEntryExpire"
            label="Default new entry expire"
            formik={ formik }
          />
          <FormikNumberInput
            preLabel="New entries will expire after"
            afterLabel="days"
            field="securityDefaultNewEntryExpireTime"
            disabled={ !formik.values.securityDefaultNewEntryExpire }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
    </SettingSection>
  )
}

export default SecuritySettings