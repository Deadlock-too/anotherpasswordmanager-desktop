import { Config } from '../../types'

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function configToInitialValues(config: Config) {
  const initialValues = {}

  for (const section in config.settings) {
    for (const setting in config.settings[section]) {
      initialValues[section + capitalizeFirstLetter(setting)] = config.settings[section][setting]
    }
  }

  return initialValues
}

function valuesToConfig(values: any, currentConfig: Config) {
  const newConfig : Config = { ...currentConfig }

  for (const section in currentConfig.settings) {
    for (const setting in currentConfig.settings[section]) {
      newConfig.settings[section][setting] = values[section + capitalizeFirstLetter(setting)]
    }
  }

  return newConfig
}

export { configToInitialValues, valuesToConfig }