import {
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

  useEffect(() => {
    window.theming.isDark().then(setInitialDarkTheme)
  }, [])

  if (isConfigLoading)
    return <Loading/>

  let context = (
    <FileContentContextProvider>
      <IdleContextProvider variant={ props.variant }>
        { props.children }
      </IdleContextProvider>
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
    <ThemeContextProvider initialDarkTheme={ initialDarkTheme }>
      { context }
    </ThemeContextProvider>
  )
}