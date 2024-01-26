import { Config } from '../../../../../types'
import { createContext, useEffect, useState } from 'react'

interface ConfigContextState {
  config: Config,
  handleUpdateConfig: (config: Config) => Promise<void>,
  isLoading: boolean
}

export const ConfigContext = createContext<ConfigContextState>({} as ConfigContextState)

export function ConfigContextProvider({ children }) {
  const [ config, setConfig ] = useState<Config>({} as Config)
  const [ isLoading, setIsLoading ] = useState<boolean>(true)

  const reloadConfig = () => {
    setIsLoading(true)
    window.settings.readConfig().then((config) => {
      setConfig(config)
      setIsLoading(false)
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
    setIsLoading(true)
    setConfig(config)
    window.settings.writeConfig(config)
      .then(() => {
        setIsLoading(false)
      })
  }

  const context: ConfigContextState = {
    config,
    handleUpdateConfig,
    isLoading
  }

  return (
    <ConfigContext.Provider value={ context }>
      { children }
    </ConfigContext.Provider>
  )
}