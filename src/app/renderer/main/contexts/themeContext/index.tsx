import { createContext, useEffect, useState } from 'react'
import { Config, Theme } from '../../../../../types'
import { useConfigContext } from '../index'

interface ThemeContextState {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
  setIsDark: (isDark: boolean) => void
}

export const ThemeContext = createContext<ThemeContextState>({} as ThemeContextState)

export function ThemeContextProvider({ children }) {
  const { config } = useConfigContext()

  const [ isDark, setIsDark ] = useState<boolean>(false)
  const [ theme, setTheme ] = useState<Theme>(Theme.system)

  const loadFromConfig = (config: Config) => {
    const isDarkTheme = window.theming.darkMode.isDark()
    setIsDark(isDarkTheme)
    if (config.appearance.useSystemTheme) {
      return isDark ? config.appearance.darkTheme : config.appearance.lightTheme
    }
    else {
      return config.appearance.theme
    }
  }

  useEffect(() => {
    if (config) {
      setTheme(loadFromConfig(config))
    }
  }, [config])

  useEffect(() => {
    document.querySelector('html')?.setAttribute('data-theme', theme)
  }, [theme])

  const context: ThemeContextState = {
    theme,
    setTheme,
    isDark,
    setIsDark
  }

  return (
    <ThemeContext.Provider value={ context }>
      { children }
    </ThemeContext.Provider>
  )
}