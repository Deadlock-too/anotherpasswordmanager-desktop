const ConfigIdentifiers = {
  OpenAtStartup: 'openAtStartup',
  MinimizeToTray: 'minimizeToTray',
  CloseToTray: 'closeToTray',
  AutoLockOnMinimize: 'autoLockOnMinimize',
  AutoLockOnSleep: 'autoLockOnSleep',
  AutoLockOnLock: 'autoLockOnLock',
}

const EventIdentifiers = {
  AddFolder: 'addFolder',
  GetDeletingRecordInfo: 'getDeletingRecordInfo',
  DeleteEntry: 'deleteEntry',
  CancelDeleteEntry: 'cancelDeleteEntry',
  DeleteFolder: 'deleteFolder',
  CancelDeleteFolder: 'cancelDeleteFolder',
  SetPassword: 'setPassword',
  SetFileContent: 'setFileContent',
  SetInitialized: 'setInitialized',
  Unlock: 'unlockApp',
  SaveChanges: 'saveChanges',
}

const DEFAULTS = {

}

export {
  ConfigIdentifiers,
  EventIdentifiers,
  DEFAULTS
}