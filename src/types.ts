export type Config = {
  language: string
  theme: Theme
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
  system,
  light,
  dark,
  cupcake,
  bumblebee,
  emerald,
  corporate,
  synthwave,
  retro,
  cyberpunk,
  valentine,
  halloween,
  garden,
  forest,
  aqua,
  lofi,
  pastel,
  fantasy,
  wireframe,
  black,
  luxury,
  dracula,
  cmyk,
  autumn,
  business,
  acid,
  lemonade,
  night,
  coffee,
  winter,
  dim,
  nord,
  sunset
}