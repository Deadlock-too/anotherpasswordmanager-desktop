import { createContext, useEffect, useState } from 'react'
import { Theme } from '../../../../../types'
import { useConfigContext } from '../index'

//TODO MOVE TO A CONSTANTS FILE OR A CONFIG FILE
interface ThemeContextState {
  currentTheme: Theme
  handleSetCurrentTheme: (theme: Theme, manageDark: boolean) => void
  setCurrentTheme: (theme: Theme) => void
  customTheme: Theme
  handleSetCustomTheme: (theme: Theme) => void
  isDark: boolean,
  setIsDark: (isDark: boolean) => void
  lightTheme: Theme
  setLightTheme: (theme: Theme) => void
  darkTheme: Theme
  setDarkTheme: (theme: Theme) => void
  useSystemTheme: boolean
  handleToggleUseSystemTheme: () => void
  setUseSystemTheme: (useSystemTheme: boolean) => void
}

export const ThemeContext = createContext<ThemeContextState>({} as ThemeContextState)

export function ThemeContextProvider({ children, initialDarkTheme }) {
  const { config } = useConfigContext()

  const initialTheme = config.appearance.useSystemTheme ?
    (initialDarkTheme ? config.appearance.darkTheme : config.appearance.lightTheme)
    : config.appearance.customTheme
  console.log('initialTheme', initialTheme)

  const [ currentTheme, setCurrentTheme ] = useState<Theme>(initialTheme)
  const [ customTheme, setCustomTheme ] = useState<Theme>(config.appearance.customTheme)
  const [ lightTheme, setLightTheme ] = useState<Theme>(config.appearance.lightTheme)
  const [ darkTheme, setDarkTheme ] = useState<Theme>(config.appearance.darkTheme)
  const [ useSystemTheme, setUseSystemTheme ] = useState<boolean>(config.appearance.useSystemTheme)
  const [ isDark, setIsDark ] = useState<boolean>(initialDarkTheme)
  const [ isInitialized, setIsInitialized ] = useState<boolean>(false)

  const refreshIsDark = () => {
    window.theming.isDark().then(setIsDark)
  }

  const handleSetCurrentTheme = (theme: Theme, manageDark?: boolean) => {
    const isDarkRes = window.theming.setTheme(theme, useSystemTheme)
    if (manageDark)
      setIsDark(isDarkRes)
    setCurrentTheme(theme)
  }

  useEffect(() => {
    if (useSystemTheme) {
      refreshIsDark()
      if (isDark) {
        handleSetCurrentTheme(darkTheme)
      } else {
        handleSetCurrentTheme(lightTheme)
      }
    }
  }, [ lightTheme, darkTheme ])

  useEffect(() => {
    if (useSystemTheme) {
      refreshIsDark()
      if (isDark) {
        handleSetCurrentTheme(darkTheme)
      } else {
        handleSetCurrentTheme(lightTheme)
      }
    } else {
      handleSetCurrentTheme(customTheme)
    }
  }, [ useSystemTheme ])

  useEffect(() => {
    const runLogic = (!isInitialized && useSystemTheme) || (isInitialized && (currentTheme !== customTheme || useSystemTheme))
    if (runLogic) {
      if (isDark) {
        handleSetCurrentTheme(darkTheme)
      } else {
        handleSetCurrentTheme(lightTheme)
      }
      setIsInitialized(true)
    }
  }, [ isDark ])

  const handleSetCustomTheme = (theme: Theme) => {
    handleSetCurrentTheme(theme, true)
    setCustomTheme(theme)
  }

  const handleToggleUseSystemTheme = () => {
    setUseSystemTheme(prev => !prev)
  }

  const context: ThemeContextState = {
    currentTheme,
    handleSetCurrentTheme,
    setCurrentTheme,
    customTheme,
    handleSetCustomTheme,
    isDark,
    setIsDark,
    lightTheme,
    setLightTheme,
    darkTheme,
    setDarkTheme,
    useSystemTheme,
    handleToggleUseSystemTheme,
    setUseSystemTheme
  }

  return (
    <ThemeContext.Provider value={ context }>
      { children }
    </ThemeContext.Provider>
  )
}