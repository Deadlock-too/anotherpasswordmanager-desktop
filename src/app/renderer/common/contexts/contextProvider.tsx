import {
  ConfigContextProvider,
  FileContentContextProvider,
  ModalContextProvider,
  ThemeContextProvider,
  useConfigContext
} from './index'
import { useEffect, useState } from 'react'
import { WindowContextProvider } from './windowContext'
import { Loading } from '../components'

export function ContextProvider({ children }) {
  return (
    <WindowContextProvider>
      <ConfigContextProvider>
        <InternalContextProvider>
          { children }
        </InternalContextProvider>
      </ConfigContextProvider>
    </WindowContextProvider>
  )
}

const InternalContextProvider = ({ children }) => {
  const { isConfigLoading } = useConfigContext()
  const [ initialDarkTheme, setInitialDarkTheme ] = useState<boolean>(false)

  useEffect(() => {
    window.theming.isDark().then(setInitialDarkTheme)
  }, [])

  if (isConfigLoading)
    return <Loading />

  return (
    <ThemeContextProvider initialDarkTheme={ initialDarkTheme }>
      <ModalContextProvider>
        <FileContentContextProvider>
          { children }
        </FileContentContextProvider>
      </ModalContextProvider>
    </ThemeContextProvider>
  )
}