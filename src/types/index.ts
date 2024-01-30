export type Config = {
  settings: {
    general: {
      language: Language
      openAtStartup: boolean //TODO: implement
      openMinimized: boolean //TODO: implement
      minimizeToTray: boolean //TODO: implement
      closeToTray: boolean //TODO: implement
      autoSave: boolean //TODO: implement
      autoSaveTime?: number //TODO: implement
    }
    appearance: {
      customTheme: Theme
      lightTheme: Theme
      darkTheme: Theme
      useSystemTheme: boolean
    }
    security: {
      autoLock: boolean //TODO: implement
      autoLockTime?: number //TODO: implement
      autoLockOnMinimize: boolean //TODO: implement
      autoLockOnSleep: boolean //TODO: implement
      autoCleanClipboard: boolean //TODO: implement
      autoCleanClipboardTime?: number //TODO: implement
      defaultNewEntryExpire: boolean //TODO: implement
      defaultNewEntryExpireTime?: number //TODO: implement
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