import {
  ClipboardContextProvider,
  ConfigContextProvider,
  FileContentContextProvider,
  ModalContextProvider,
  ThemeContextProvider,
  useConfigContext
} from './index'
import { ReactNode, useEffect, useState } from 'react'
import { WindowContextProvider } from './windowContext'
import { Loading } from '../components'
import { IdleContextProvider } from './idleContext'
import i18n from '../../../../i18n'
import { I18nextProvider } from 'react-i18next'

interface IContextProviderProps {
  children: ReactNode
  variant: 'main' | 'secondary'
}

export function ContextProvider(props: IContextProviderProps) {
  return (
    <WindowContextProvider>
      <ConfigContextProvider>
        <InternalContextProvider { ...props }>
          { props.children }
        </InternalContextProvider>
      </ConfigContextProvider>
    </WindowContextProvider>
  )
}

const InternalContextProvider = (props: IContextProviderProps) => {
  const { isConfigLoading } = useConfigContext()
  const [ initialDarkTheme, setInitialDarkTheme ] = useState<boolean>(false)
  const [ initialI18nStore, setInitialI18nStore ] = useState(null)

  useEffect(() => {
    window.app.localization.getInitialI18nStore().then(setInitialI18nStore)
    window.app.localization.startupLanguage.then(language => i18n.changeLanguage(language))
    window.app.theming.isDark().then(setInitialDarkTheme)
  }, [])

  if (isConfigLoading || !initialI18nStore)
    return <Loading/>

  let context = (
    <FileContentContextProvider>
      <ClipboardContextProvider>
        <IdleContextProvider variant={ props.variant }>
          { props.children }
        </IdleContextProvider>
      </ClipboardContextProvider>
    </FileContentContextProvider>
  )

  if (props.variant === 'main') {
    context = (
      <ModalContextProvider>
        { context }
      </ModalContextProvider>
    )
  }

  return (
    <I18nextProvider i18n={ i18n.default }>
      <ThemeContextProvider initialDarkTheme={ initialDarkTheme }>
        { context }
      </ThemeContextProvider>
    </I18nextProvider>
  )
}