import { createContext, useEffect, useState } from 'react'

interface ThemeContextState {
  theme: string
  setTheme: (theme: string) => void
  isDark: boolean
  setIsDark: (isDark: boolean) => void
  toggleDarkMode: () => void
}

export const ThemeContext = createContext<ThemeContextState>({} as ThemeContextState)

export function ThemeContextProvider({ children }) {
  const [ theme, setTheme ] = useState<string>('light')
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