import { createContext, useState } from 'react'
import { Config, Theme } from '../../../../../types'

const DEFAULT_LIGHT_THEME = Theme.light
const DEFAULT_DARK_THEME = Theme.dark

interface ThemeContextState {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  setIsDark: (isDark: boolean) => void
  toggleDarkMode: () => void
}

function LoadFromConfig(config: Config) {
  return config?.theme ?? Theme.system
}

export const ThemeContext = createContext<ThemeContextState>({} as ThemeContextState)

export function ThemeContextProvider({ children, config }: { children: any, config: Config }) {
  const configTheme = LoadFromConfig(config)

  const [ theme, setTheme ] = useState<Theme>(Theme.system)
  const [ isDark, setIsDark ] = useState<boolean>(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
  }

  const context: ThemeContextState = {
    theme,
    setTheme,
    isDark,
    setIsDark,
    toggleDarkMode
  }

  return (
    <ThemeContext.Provider value={ context }>
      { children }
    </ThemeContext.Provider>
  )
}