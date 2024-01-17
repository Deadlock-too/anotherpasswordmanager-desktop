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
  FILE_OPEN: {
    OPENED: 'file-opened',
    FAILED: 'failed-open-file',
    OPEN_FROM_PATH: 'open-file-from-path',
    SET_FILE_CONTENT: 'set-file-content'
  },
  ROUTE: 'route',
}

export default IpcEventNames