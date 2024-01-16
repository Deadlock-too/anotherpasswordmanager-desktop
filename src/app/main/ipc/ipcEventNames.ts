const IpcEventNames = {
  FILE_MANAGEMENT: {
    OPEN: 'fileManagement:open',
    SAVE: 'fileManagement:save',
  },
  DARK_MODE: {
    TOGGLE: 'darkMode:toggle',
    IS_DARK: 'darkMode:isDark',
    SYSTEM: 'darkMode:system',
  },
  CLIPBOARD: {
    READ: 'clipboard:read',
    WRITE: 'clipboard:write',
  },
  ELECTRON: {
    SAVE_FILE: 'electron:save-file',
  },
  PASSWORD: {
    INPUT: 'password:input',
    RESULT: 'password:result',
  },
  FILE_OPEN: {
    OPENED: 'file-opened',
    FAILED: 'failed-open-file',
  }
}

export default IpcEventNames