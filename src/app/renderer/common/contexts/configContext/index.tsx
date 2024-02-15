import { Config } from '../../../../../types'
import { createContext, useEffect, useState } from 'react'

interface ConfigContextState {
  config: Config,
  handleUpdateConfig: (config: Config) => Promise<void>,
  isConfigLoading: boolean,
  setIsConfigLoading: (isLoading: boolean) => void
  reloadConfig: () => void
}

export const ConfigContext = createContext<ConfigContextState>({} as ConfigContextState)

export function ConfigContextProvider({ children }) {
  const [ config, setConfig ] = useState<Config>({} as Config)
  const [ isConfigLoading, setIsConfigLoading ] = useState<boolean>(true)

  const reloadConfig = () => {
    window.settings.readConfig().then((config) => {
      setConfig(config)
      setIsConfigLoading(false)
    })
  }

  useEffect(() => {
    reloadConfig()
  }, [])

  // useEffect(() => {
  //   console.log(JSON.stringify(config))
  // }, [config])

  // //Refresh config every 10 seconds
  // useEffect(() => {
  //   reloadConfig()
  //   const intervalId = setInterval(reloadConfig, 1000 * 10)
  //   return () => clearInterval(intervalId)
  // }, [])

  const handleUpdateConfig = async (config: Config) => {
    setConfig(config)
    window.settings.writeConfig(config)
      .then(() => {
        setIsConfigLoading(false)
      })
  }

  const context: ConfigContextState = {
    config,
    handleUpdateConfig,
    isConfigLoading,
    setIsConfigLoading,
    reloadConfig
  }

  return (
    <ConfigContext.Provider value={ context }>
      { children }
    </ConfigContext.Provider>
  )
}