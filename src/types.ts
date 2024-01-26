export type Config = {
  settings: {
    general: {
      language: string
      openAtStartup: boolean
      openMinimized: boolean
      minimizeToTray: boolean
      closeToTray: boolean
      autoSave: boolean
      autoSaveTime?: number
    }
    appearance: {
      customTheme: Theme
      lightTheme: Theme
      darkTheme: Theme
      useSystemTheme: boolean
    }
    security: {
      autoLock: boolean
      autoLockTime?: number
      autoLockOnMinimize: boolean
      autoLockOnSleep: boolean
      autoCleanClipboard: boolean
      autoCleanClipboardTime?: number
      defaultNewEntryExpire: boolean
      defaultNewEntryExpireTime?: number
    }
  }
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