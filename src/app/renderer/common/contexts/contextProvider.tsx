import {
  ConfigContextProvider,
  FileContentContextProvider,
  ModalContextProvider,
  ThemeContextProvider,
  useConfigContext
} from './index'
import { useEffect, useState } from 'react'

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
  const { isConfigLoading } = useConfigContext()
  const [ initialDarkTheme, setInitialDarkTheme ] = useState<boolean>(false)

  useEffect(() => {
    window.theming.isDark().then(setInitialDarkTheme)
  }, [])

  if (isConfigLoading)
    return (
      <div className="h-screen w-screen bg-base-100 flex justify-center items-center">
        <div className="loading loading-spinner loading-lg"/>
      </div>
    )

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