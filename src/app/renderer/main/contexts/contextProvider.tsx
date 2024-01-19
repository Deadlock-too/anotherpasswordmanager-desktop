import {
  ConfigContextProvider,
  FileContentContextProvider,
  ModalContextProvider,
  ThemeContextProvider,
  useConfigContext
} from './index'

export function ContextProvider({ children }) {
  return (
    <ConfigContextProvider>
      {
        (() => {
          const { config } = useConfigContext()
          return (
            <ThemeContextProvider config={ config }>
              <ModalContextProvider>
                <FileContentContextProvider config={ config }>
                  { children }
                </FileContentContextProvider>
              </ModalContextProvider>
            </ThemeContextProvider>
          )
        })()
      }
    </ConfigContextProvider>
  )
}