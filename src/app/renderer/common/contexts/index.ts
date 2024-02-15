import { useContext } from 'react'
import { FileContentContext, FileContentContextProvider } from './fileContentContext'
import { ModalContext, ModalContextProvider } from './modalContext'
import { ThemeContext, ThemeContextProvider } from './themeContext'
import { ConfigContext, ConfigContextProvider } from './configContext'
import { LocalContext, LocalContextProvider } from './scrollContext'
import { WindowContext, WindowContextProvider } from './windowContext'
import { IdleContext, IdleContextProvider } from './idleContext'


const useFileContentContext = () => useContext(FileContentContext)
const useModalContext = () => useContext(ModalContext)
const useThemeContext = () => useContext(ThemeContext)
const useConfigContext = () => useContext(ConfigContext)
const useLocalContext = () => useContext(LocalContext)
const useWindowContext = () => useContext(WindowContext)
const useIdleContext = () => useContext(IdleContext)

export {
  useFileContentContext,
  FileContentContextProvider,
  useModalContext,
  ModalContextProvider,
  useThemeContext,
  ThemeContextProvider,
  useConfigContext,
  ConfigContextProvider,
  useLocalContext,
  LocalContextProvider,
  useWindowContext,
  WindowContextProvider,
  useIdleContext,
  IdleContextProvider
}