import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { FormikCheckbox, FormikNumberInput } from '../../../../common/components'
import { useTranslation } from 'react-i18next'

//TODO move min and max values to a consts file
const SecuritySettings = ({ formik }) => {
  const { t } = useTranslation()
  return (
    <SettingSection title={ t('SettingsDialog.Security.Title') }>
      <Setting title={ t('SettingsDialog.Security.Auto lock.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLock"
            label={ t('SettingsDialog.Security.Auto lock.Auto lock') }
            formik={ formik }
          />
          <FormikNumberInput
            preLabel={ t('SettingsDialog.Security.Auto lock.Auto lock after') }
            afterLabel={ t('SettingsDialog.Security.Auto lock.seconds') }
            field="securityAutoLockTime"
            disabled={ !formik.values.securityAutoLock }
            formik={ formik }
            min={ 1 }
            max={ 60 * 60 * 24 * 7 }
          />
        </SettingRow>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLockOnMinimize"
            label={ t('SettingsDialog.Security.Auto lock.On minimize') }
            formik={ formik }
          />
          <FormikCheckbox
            field="securityAutoLockOnSleep"
            label={ t('SettingsDialog.Security.Auto lock.On sleep') }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.Security.Clipboard.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoCleanClipboard"
            label={ t('SettingsDialog.Security.Clipboard.Auto clear clipboard') }
            formik={ formik }
          />
          <FormikNumberInput
            preLabel={ t('SettingsDialog.Security.Clipboard.Clear after') }
            afterLabel={ t('SettingsDialog.Security.Clipboard.seconds') }
            field="securityAutoCleanClipboardTime"
            disabled={ !formik.values.securityAutoCleanClipboard }
            formik={ formik }
            min={ 1 }
            max={ 60 * 60 * 24 * 7 }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.Security.Entry expire.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="securityDefaultNewEntryExpire"
            label={ t('SettingsDialog.Security.Entry expire.Default new entry expire') }
            formik={ formik }
          />
          <FormikNumberInput
            preLabel={ t('SettingsDialog.Security.Entry expire.New entries will expire after') }
            afterLabel={ t('SettingsDialog.Security.Entry expire.days') }
            field="securityDefaultNewEntryExpireTime"
            disabled={ !formik.values.securityDefaultNewEntryExpire }
            formik={ formik }
            min={ 1 }
            max={ 365 * 100 }
          />
        </SettingRow>
      </Setting>
    </SettingSection>
  )
}

export default SecuritySettings