import { createRoot } from 'react-dom/client'
import SettingsInterface from './components/modal/settings'
import TitleBar from '../main/components/titlebar'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../../i18n'
import { ContextProvider } from '../main/contexts/contextProvider'
import { useConfigContext, useThemeContext } from '../main/contexts'
import { useEffect } from 'react'

const rootDiv = document.getElementById('secondary_root')
if (!rootDiv)
  throw new Error('Root div not found')

const variant = window.name

const Settings = () => {
  return (
    <ContextProvider>
      <InternalSettings/>
    </ContextProvider>
  )
}

const InternalSettings = () => {
  const { config, isLoading } = useConfigContext()
  const { setIsDark } = useThemeContext()

  useEffect(() => {
    const updateIsDarkHandler = (isDark) => {
      setIsDark(isDark)
    }
    window.electron.subscribeToUpdateIsDark(updateIsDarkHandler)

    return () => {
      window.electron.unsubscribeToUpdateIsDark()
    }
  }, [])

  return (<>
      <TitleBar variant="secondary" title={ i18n.t('Settings') } onClose={ () => window.close() }/>
      <div className="main-content p-2">
        {
          isLoading ?
            null
            :
            <SettingsInterface key={JSON.stringify(config)}/>
        }
      </div>
    </>
  )
}

let component
switch (variant) {
  case 'settings':
    component = <Settings/>
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