import { Config } from '../../types'
import defaultConfig from '../../defaultConfig.json'
import { capitalizeFirstLetter } from '../'

function configToInitialValues(config: Config) {
  const initialValues = {}

  // Iterating over the default settings to set eventual missing settings to their default values
  for (const section in defaultConfig.settings) {
    for (const setting in defaultConfig.settings[section]) {
      initialValues[section + capitalizeFirstLetter(setting)] = config.settings[section][setting] ?? defaultConfig.settings[section][setting]
    }
  }

  return initialValues
}

function valuesToConfig(values: any, currentConfig: Config) {
  const newConfig : Config = { ...currentConfig }

  for (const section in defaultConfig.settings) {
    for (const setting in defaultConfig.settings[section]) {
      newConfig.settings[section][setting] = values[section + capitalizeFirstLetter(setting)]
    }
  }

  return newConfig
}

export { configToInitialValues, valuesToConfig }