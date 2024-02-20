const IpcEventNames = {
  App: {
    SetSecondaryWindowEntry: 'app:setSecondaryWindowEntry',
    Lock: 'app:lock',
    File: {
      OpenDialog: 'app:file:openDialog',
      SaveDialog: 'app:file:saveDialog',
      Save: 'app:file:save',
      Open: 'app:file:open',
      OpenSuccess: 'app:file:openSuccess',
      OpenFailed: 'app:file:openFailed',
      OpenFromPath: 'app:file:openFromPath',
    },
    Config: {
      Get: 'app:config:get',
      Set: 'app:config:set',
      Apply: 'app:config:apply',
      Refresh: 'app:config:refresh',
    },
    Theming: {
      GetStartupTheme: 'app:theming:getStartupTheme',
      IsDark: 'app:theming:isDark',
      IsSystem: 'app:theming:isSystem',
      UpdateIsDark: 'app:theming:updateIsDark',
      SetTheme: 'app:theming:setTheme',
      UpdateTheme: 'app:theming:updateTheme',
      SetSystem: 'app:theming:setSystem',
    },
    Localization: {
      ChangeLanguage: 'app:localization:changeLanguage',
      GetStartupLanguage: 'app:localization:getStartupLanguage',
    },
  },
  System: {
    Clipboard: {
      Read: 'system:clipboard:read',
      Write: 'system:clipboard:write',
      Clear: 'system:clipboard:clear',
    },
  },
  Electron: {
    Log: 'log',
    Events: {
      Propagate: 'electron:propagate',
      PropagateResult: 'electron:propagateResult'
    }
  },
}

export default IpcEventNames