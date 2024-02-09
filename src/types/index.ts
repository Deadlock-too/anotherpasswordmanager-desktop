export type Config = {
  settings: {
    general: {
      language: Language
      openAtStartup: boolean //TODO ID-0
      openMinimized: boolean //TODO ID-0
      minimizeToTray: boolean //TODO ID-0
      closeToTray: boolean //TODO ID-0
      autoSave: boolean //TODO ID-0
      autoSaveTime?: number //TODO ID-0
    }
    appearance: {
      customTheme: Theme
      lightTheme: Theme
      darkTheme: Theme
      useSystemTheme: boolean
    }
    security: {
      autoLock: boolean //TODO ID-0
      autoLockTime?: number //TODO ID-0
      autoLockOnMinimize: boolean //TODO ID-0
      autoLockOnSleep: boolean //TODO ID-0
      autoCleanClipboard: boolean //TODO ID-0
      autoCleanClipboardTime?: number //TODO ID-0
      copyFieldValuesToClipboardOnClick: boolean
      defaultNewEntryExpire: boolean //TODO ID-0
      defaultNewEntryExpireTime?: number //TODO ID-0
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