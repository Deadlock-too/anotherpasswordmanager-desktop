import { Config } from '../../../../../types'
import { createContext, useState } from 'react'

interface ConfigContextState {
  config: Config
}

export const ConfigContext = createContext<ConfigContextState>({} as ConfigContextState)

export function ConfigContextProvider({ children }) {
  const [ config, setConfig ] = useState<Config>({} as Config)

  //Refresh config every 10 seconds
  setInterval(() => {
    //reload config
    //...
  }, 1000 * 10)

  const context: ConfigContextState = {
    config: {} as Config
  }

  return (
    <ConfigContext.Provider value={ context }>
      {children}
    </ConfigContext.Provider>
  )
}