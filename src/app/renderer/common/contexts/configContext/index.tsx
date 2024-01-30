import { Config } from '../../../../../types'
import { createContext, useEffect, useState } from 'react'

interface ConfigContextState {
  config: Config,
  handleUpdateConfig: (config: Config) => Promise<void>,
  isConfigLoading: boolean,
  setIsConfigLoading: (isLoading: boolean) => void
}

export const ConfigContext = createContext<ConfigContextState>({} as ConfigContextState)

export function ConfigContextProvider({ children }) {
  const [ config, setConfig ] = useState<Config>({} as Config)
  const [ isConfigLoading, setIsConfigLoading ] = useState<boolean>(true)

  const reloadConfig = () => {
    setIsConfigLoading(true)
    window.settings.readConfig().then((config) => {
      setConfig(config)
      setIsConfigLoading(false)
    })
  }

  useEffect(() => {
    reloadConfig()
  }, [])

  // //Refresh config every 10 seconds
  // useEffect(() => {
  //   reloadConfig()
  //   const intervalId = setInterval(reloadConfig, 1000 * 10)
  //   return () => clearInterval(intervalId)
  // }, [])

  const handleUpdateConfig = async (config: Config) => {
    setIsConfigLoading(true)
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
  }

  return (
    <ConfigContext.Provider value={ context }>
      { children }
    </ConfigContext.Provider>
  )
}