export type Config = {
  settings: {
    general: {
      language: Language
      openAtStartup: boolean
      openMinimized: boolean
      minimizeToTray: boolean
      closeToTray: boolean
      autoSave: boolean
    }
    appearance: {
      customTheme: Theme
      lightTheme: Theme
      darkTheme: Theme
      useSystemTheme: boolean
    }
    security: {
      autoLock: boolean //TODO ID-0.7
      autoLockTime?: number //TODO ID-0.8
      autoLockOnMinimize: boolean //TODO ID-0.9
      autoLockOnSleep: boolean //TODO ID-0.10
      autoLockOnTray: boolean //TODO ID-0.15
      autoCleanClipboard: boolean //TODO ID-0.11
      autoCleanClipboardTime?: number //TODO ID-0.12
      copyFieldValuesToClipboardOnClick: boolean
      defaultNewEntryExpire: boolean //TODO ID-0.13
      defaultNewEntryExpireTime?: number //TODO ID-0.14
    }
  }
}

export enum Language {
  Italian = 'it',
  English = 'en'
}

export enum Theme {
  system = 'system',
  light = 'light',
  dark = 'dark',
  cupcake = 'cupcake',
  bumblebee = 'bumblebee',
  emerald = 'emerald',
  corporate = 'corporate',
  synthwave = 'synthwave',
  retro = 'retro',
  cyberpunk = 'cyberpunk',
  valentine = 'valentine',
  halloween = 'halloween',
  garden = 'garden',
  forest = 'forest',
  aqua = 'aqua',
  lofi = 'lofi',
  pastel = 'pastel',
  fantasy = 'fantasy',
  wireframe = 'wireframe',
  black = 'black',
  luxury = 'luxury',
  dracula = 'dracula',
  cmyk = 'cmyk',
  autumn = 'autumn',
  business = 'business',
  acid = 'acid',
  lemonade = 'lemonade',
  night = 'night',
  coffee = 'coffee',
  winter = 'winter',
  dim = 'dim',
  nord = 'nord',
  sunset = 'sunset'
}