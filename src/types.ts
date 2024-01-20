export type Config = {
  appearance: {
    theme: Theme
    previousTheme: Theme
    lightTheme: Theme
    darkTheme: Theme
    useSystemTheme: boolean
  }
  language: string
  lastOpenedFiles: string[]
  settings: {
    // security: {
    //   autoLock: boolean
    //   autoLockTime?: number
    //   autoLockOnMinimize: boolean
    //   autoCleanClipboard: boolean
    //   autoCleanClipboardTime?: number
    //   defaultNewPasswordExpire: boolean
    //   defaultNewPasswordExpireTime?: number
    // }
    openAtStartup: boolean
    autoSave: boolean
    autoSaveTime?: number
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