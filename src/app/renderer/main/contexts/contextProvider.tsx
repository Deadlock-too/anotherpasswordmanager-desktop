import {
  ConfigContextProvider,
  FileContentContextProvider,
  ModalContextProvider,
  ThemeContextProvider,
  useConfigContext
} from './index'
import { useState } from 'react'

export function ContextProvider({ children }) {
  return (
    <ConfigContextProvider>
      <InternalContextProvider>
        { children }
      </InternalContextProvider>
    </ConfigContextProvider>
  )
}

const InternalContextProvider = ({ children }) => {
  const { isLoading } = useConfigContext()
  const [ initialDarkTheme, setInitialDarkTheme ] = useState<boolean>(false)

  window.theming.isDark().then(setInitialDarkTheme)

  if (isLoading)
    return null

  return (
    <ThemeContextProvider initialDarkTheme={initialDarkTheme}>
      <ModalContextProvider>
        <FileContentContextProvider>
          { children }
        </FileContentContextProvider>
      </ModalContextProvider>
    </ThemeContextProvider>
  )
}

//TODO: DON'T WRAP EVERYTHING IN CONTEXT PROVIDERS BUT ONLY A SPECIFIC MANAGER THAT WILL MANAGE THE STATE OF THE CONTEXT AND WILL PREVENT UNNECESSARY RE-RENDERS