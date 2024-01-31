const IpcEventNames = {
  FileManagement: {
    Open: 'fileManagement:open',
    Save: 'fileManagement:save',
  },
  Theming: {
    GetStartupTheme: 'theming:getStartupTheme',
    IsDark: 'theming:isDark',
    IsSystem: 'theming:isSystem',
    UpdateIsDark: 'theming:updateIsDark',
    SetTheme: 'theming:setTheme',
    UpdateTheme: 'theming:updateTheme',
    SetSystem: 'theming:setSystem',
  },
  Clipboard: {
    Read: 'clipboard:read',
    Write: 'clipboard:write',
  },
  Electron: {
    SaveFile: 'electron:saveFile',
    SetSecondaryWindowEntry: 'electron:setSecondaryWindowEntry',
  },
  FileOpen: {
    Opened: 'fileOpen:fileOpened',
    Failed: 'fileOpen:failedOpenFile',
    OpenFromPath: 'fileOpen:openFileFromPath',
    SetFileContent: 'fileOpen:setFileContent',
  },
  Config: {
    Get: 'config:get',
    Set: 'config:set',
    Update: 'config:update',
  },
  Localization: {
    ChangeLanguage: 'localization:changeLanguage',
    GetStartupLanguage: 'localization:getStartupLanguage',
  },
  ROUTE: 'route',
}

export default IpcEventNames