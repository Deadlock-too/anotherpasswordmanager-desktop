import { useContext } from 'react'
import { FileContentContext, FileContentContextProvider } from './fileContentContext'
import { ModalContext, ModalContextProvider } from './modalContext'
import { ThemeContext, ThemeContextProvider } from './themeContext'
import { ConfigContext, ConfigContextProvider } from './configContext'
import { ScrollContext, ScrollContextProvider } from './scrollContext'

const useFileContentContext = () => useContext(FileContentContext)
const useModalContext = () => useContext(ModalContext)
const useThemeContext = () => useContext(ThemeContext)
const useConfigContext = () => useContext(ConfigContext)
const useScrollContext = () => useContext(ScrollContext)

export {
  useFileContentContext,
  FileContentContextProvider,
  useModalContext,
  ModalContextProvider,
  useThemeContext,
  ThemeContextProvider,
  useConfigContext,
  ConfigContextProvider,
  useScrollContext,
  ScrollContextProvider
}