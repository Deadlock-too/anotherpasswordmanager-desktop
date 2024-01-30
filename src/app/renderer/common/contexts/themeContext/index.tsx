import { createContext, useEffect, useState } from 'react'
import { Theme } from '../../../../../types'
import { useConfigContext } from '../index'

interface ThemeContextState {
  currentTheme: Theme
  setCurrentTheme: (theme: Theme) => void
  customTheme: Theme
  isDark: boolean,
  setIsDark: (isDark: boolean) => void
  lightTheme: Theme
  setLightTheme: (theme: Theme) => void
  darkTheme: Theme
  setDarkTheme: (theme: Theme) => void
  useSystemTheme: boolean
  handleToggleUseSystemTheme: () => void
  setUseSystemTheme: (useSystemTheme: boolean) => void
  setTemporaryLightTheme: (theme: Theme | undefined) => void
  setTemporaryDarkTheme: (theme: Theme | undefined) => void
  setTemporaryUseSystemTheme: (useSystemTheme: boolean | undefined) => void
}

export const ThemeContext = createContext<ThemeContextState>({} as ThemeContextState)

export function ThemeContextProvider({ children, initialDarkTheme }) {
  const { config } = useConfigContext()

  const initialTheme = config.settings.appearance.useSystemTheme ?
    (initialDarkTheme ? config.settings.appearance.darkTheme : config.settings.appearance.lightTheme)
    : config.settings.appearance.customTheme

  const [ currentTheme, setCurrentTheme ] = useState<Theme>(initialTheme)
  const [ customTheme, setCustomTheme ] = useState<Theme>(config.settings.appearance.customTheme)
  const [ lightTheme, setLightTheme ] = useState<Theme>(config.settings.appearance.lightTheme)
  const [ darkTheme, setDarkTheme ] = useState<Theme>(config.settings.appearance.darkTheme)
  const [ useSystemTheme, setUseSystemTheme ] = useState<boolean>(config.settings.appearance.useSystemTheme)
  const [ isDark, setIsDark ] = useState<boolean>(initialDarkTheme)
  const [ temporaryUseSystemTheme, setTemporaryUseSystemTheme ] = useState<boolean | undefined>()
  const [ temporaryLightTheme, setTemporaryLightTheme ] = useState<Theme | undefined>()
  const [ temporaryDarkTheme, setTemporaryDarkTheme ] = useState<Theme | undefined>()

  const handleSetCurrentTheme = (theme: Theme, manageDark: boolean, setSystem: boolean) => {
    window.theming.setTheme(theme, setSystem).then(isDarkRes => {
      if (manageDark)
        setIsDark(isDarkRes)
    })
    setCurrentTheme(theme)
  }

  //Handle config update
  useEffect(() => {
    setUseSystemTheme(config.settings.appearance.useSystemTheme)
    setLightTheme(config.settings.appearance.lightTheme)
    setDarkTheme(config.settings.appearance.darkTheme)
    setCustomTheme(config.settings.appearance.customTheme)

    if (useSystemTheme) {
      handleSetCurrentTheme(isDark ? darkTheme : lightTheme, false, true)
    } else {
      handleSetCurrentTheme(customTheme, true, false)
    }
  }, [config])

  useEffect(() => {
    if (temporaryUseSystemTheme ?? useSystemTheme) {
      if (isDark) {
        handleSetCurrentTheme(temporaryDarkTheme ?? darkTheme, false, true)
      } else {
        handleSetCurrentTheme(temporaryLightTheme ?? lightTheme, false, true)
      }
    }
  }, [ isDark ])

  const handleToggleUseSystemTheme = () => {
    setUseSystemTheme(prev => !prev)
  }

  const context: ThemeContextState = {
    currentTheme,
    setCurrentTheme,
    customTheme,
    isDark,
    setIsDark,
    lightTheme,
    setLightTheme,
    darkTheme,
    setDarkTheme,
    useSystemTheme,
    handleToggleUseSystemTheme,
    setUseSystemTheme,
    setTemporaryLightTheme,
    setTemporaryDarkTheme,
    setTemporaryUseSystemTheme,
  }

  return (
    <ThemeContext.Provider value={ context }>
      { children }
    </ThemeContext.Provider>
  )
}