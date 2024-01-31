import { createRoot } from 'react-dom/client'
import Settings from './scenes/settings'
import TitleBar from '../main/components/titlebar'
import { I18nextProvider, useTranslation } from 'react-i18next'
import i18n from '../../../i18n'
import { ContextProvider } from '../common/contexts/contextProvider'
import { useConfigContext, useThemeContext } from '../common/contexts'
import { useEffect, useRef, useState } from 'react'
import { FormikProps } from 'formik'

const rootDiv = document.getElementById('secondary_root')
if (!rootDiv)
  throw new Error('Root div not found')

let initialized = false
window.theming.startupThemeAsync.then(theme => {
  if (initialized)
    return

  document.querySelector('html')?.setAttribute('data-theme', theme)
  initialized = true
})

const variant = window.name

const SettingsWindow = () => {
  return (
    <ContextProvider>
      <InternalSettings/>
    </ContextProvider>
  )
}

const InternalSettings = () => {
  const { config, isConfigLoading } = useConfigContext()
  const { setIsDark } = useThemeContext()
  const { t } = useTranslation()
  const [ isLanguageLoading, setIsLanguageLoading ] = useState<boolean>(true)
  const formikRef = useRef<FormikProps<any>>(null);

  useEffect(() => {
    const updateIsDarkHandler = (isDark) => {
      setIsDark(isDark)
    }
    window.electron.subscribeToUpdateIsDark(updateIsDarkHandler)

    window.localization.startupLanguage
      .then((lang) => i18n.changeLanguage(lang))
      .then(() => setIsLanguageLoading(false))

    return () => {
      window.electron.unsubscribeToUpdateIsDark()
    }
  }, [])

  const handleClose = () => {
    formikRef.current?.resetForm()
  }

  if (isConfigLoading || isLanguageLoading)
    return (
      <div className="h-screen w-screen bg-base-100 flex justify-center items-center">
        <div className="loading loading-spinner loading-lg"/>
      </div>
    )

  return (<>
      <TitleBar variant="secondary" title={ t('SettingsDialog.Title') } onClose={ handleClose }/>
      <div className="main-content p-2">
        <Settings key={ JSON.stringify(config) } formikRef={formikRef} />
      </div>
    </>
  )
}

let component
switch (variant) {
  case 'settings':
    component = <SettingsWindow/>
    break
  default:
    component = <div>Unknown variant</div>
}

const root = createRoot(rootDiv)
root.render(
  <I18nextProvider i18n={ i18n.default }>
    { component }
  </I18nextProvider>
)