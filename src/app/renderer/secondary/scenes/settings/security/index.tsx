import { Setting, SettingRow, SettingSection } from '../../../components/settings'
import { FormikCheckbox, FormikNumberInput } from '../../../../common/components'
import { useTranslation } from 'react-i18next'

//TODO ID-20
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
            min={ 30 }
            max={ 60 * 60 * 12 }
          />
        </SettingRow>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLockOnMinimize"
            label={ t('SettingsDialog.Security.Auto lock.On minimize') }
            formik={ formik }
          />
          <FormikCheckbox
            field="securityAutoLockOnTray"
            label={ t('SettingsDialog.Security.Auto lock.On tray') }
            formik={ formik }
          />
        </SettingRow>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoLockOnSleep"
            label={ t('SettingsDialog.Security.Auto lock.On sleep') }
            formik={ formik }
          />
          <FormikCheckbox
            field="securityAutoLockOnLock"
            label={ t('SettingsDialog.Security.Auto lock.On lock') }
            formik={ formik }
          />
        </SettingRow>
      </Setting>
      <Setting title={ t('SettingsDialog.Security.Clipboard.Title') }>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoClearClipboard"
            label={ t('SettingsDialog.Security.Clipboard.Auto clear clipboard') }
            formik={ formik }
          />
          <FormikNumberInput
            preLabel={ t('SettingsDialog.Security.Clipboard.Clear after') }
            afterLabel={ t('SettingsDialog.Security.Clipboard.seconds') }
            field="securityAutoClearClipboardTime"
            disabled={ !formik.values.securityAutoClearClipboard }
            formik={ formik }
            min={ 1 }
            max={ 60 * 60 }
          />
        </SettingRow>
        <SettingRow>
          <FormikCheckbox
            field="securityAutoClearClipboardOnLock"
            label={ t('SettingsDialog.Security.Clipboard.Clear on lock') }
            formik={ formik }
          />
          <FormikCheckbox
            field="securityCopyFieldValuesToClipboardOnClick"
            label={ t('SettingsDialog.Security.Clipboard.Copy field values to clipboard on click') }
            formik={ formik }
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