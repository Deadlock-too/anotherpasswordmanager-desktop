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
      <InternalContextProvider>
        { children }
      </InternalContextProvider>
    </ConfigContextProvider>
  )
}

const InternalContextProvider = ({ children }) => {
  const { isLoading } = useConfigContext()

  if (isLoading)
    return null

  return (
    <ThemeContextProvider>
      <ModalContextProvider>
        <FileContentContextProvider>
          { children }
        </FileContentContextProvider>
      </ModalContextProvider>
    </ThemeContextProvider>
  )
}

//TODO: DON'T WRAP EVERYTHING IN CONTEXT PROVIDERS BUT ONLY A SPECIFIC MANAGER THAT WILL MANAGE THE STATE OF THE CONTEXT AND WILL PREVENT UNNECESSARY RE-RENDERS