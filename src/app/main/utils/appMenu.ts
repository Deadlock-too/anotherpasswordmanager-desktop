import { Menu, MenuItem } from 'electron'
import i18n from '../../../i18n'

export default function setAppMenu() {
  const menu = new Menu()
  setMenuEntries(menu)
  Menu.setApplicationMenu(menu)
}

function localizeAppMenu(menuKey: string, localizationKey: string) {
  return i18n.t(`AppMenu.${menuKey}.${localizationKey}`)
}

function setMenuEntries(menu: Menu) {
  menu.append(setFileMenu())
  menu.append(setEntryMenu())
  menu.append(setFindMenu())
  menu.append(setViewMenu())
  menu.append(setToolsMenu())
  menu.append(setHelpMenu())
}

function setFileMenu(): MenuItem {
  const fileMenuKey = 'File'
  return new MenuItem({
    label: localizeAppMenu(fileMenuKey, fileMenuKey),
    submenu: [
      {
        label: localizeAppMenu(fileMenuKey, 'New'),
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          console.log('New File')
        }
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Open'),
        submenu: [
          {
            label: localizeAppMenu(fileMenuKey, 'Open File'),
            accelerator: 'CmdOrCtrl+O',
            click: () => {
              console.log('Open File')
            }
          },
          {
            label: localizeAppMenu(fileMenuKey, 'Open from URL'),
            accelerator: 'CmdOrCtrl+Shift+O',
            click: () => {
              console.log('Open URL')
            }
          }
        ]
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Open Recent'),
        submenu: [
          {
            label: '...',
            click: () => {
              console.log('Open Recent ...')
            }
          },
          {
            type: 'separator'
          },
          {
            label: localizeAppMenu(fileMenuKey, 'Clear Recent'),
            click: () => {
              console.log('Clear Recent')
            }
          }
        ]
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Close'),
        accelerator: 'CmdOrCtrl+W',
        click: () => {
          console.log('Close File')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Save'),
        accelerator: 'CmdOrCtrl+S',
        click: () => {
          console.log('Save File')
        }
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Save As'),
        accelerator: 'CmdOrCtrl+Shift+S',
        click: () => {
          console.log('Save File As')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(fileMenuKey, 'File Settings'),
        click: () => {
          console.log('File Settings')
        }
      },
      {
        label: localizeAppMenu(fileMenuKey, 'File Key Password'),
        click: () => {
          console.log('File Key Password')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Import'),
        accelerator: 'CmdOrCtrl+I',
        click: () => {
          console.log('Import File')
        }
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Export'),
        accelerator: 'CmdOrCtrl+E',
        click: () => {
          console.log('Export File')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Lock'),
        accelerator: 'CmdOrCtrl+L',
        click: () => {
          console.log('Lock File')
        }
      },
      {
        label: localizeAppMenu(fileMenuKey, 'Exit'),
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          console.log('Exit')
        }
      }
    ]
  })
}

function setEntryMenu(): MenuItem {
  const entryMenuKey = 'Entry'
  return new MenuItem({
    label: localizeAppMenu(entryMenuKey, entryMenuKey),
    submenu: [
      {
        label: localizeAppMenu(entryMenuKey, 'Copy Username'),
        accelerator: 'CmdOrCtrl+B',
        click: () => {
          console.log('Copy Username')
        }
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Copy Password'),
        accelerator: 'CmdOrCtrl+C',
        click: () => {
          console.log('Copy Password')
        }
      },
      {
        label: localizeAppMenu(entryMenuKey, 'URL'),
        submenu: [
          {
            label: localizeAppMenu(entryMenuKey, 'Open URL'),
            accelerator: 'CmdOrCtrl+U',
            click: () => {
              console.log('Open URL')
            }
          },
          {
            label: localizeAppMenu(entryMenuKey, 'Copy URL'),
            accelerator: 'CmdOrCtrl+Shift+U',
            click: () => {
              console.log('Copy URL')
            }
          }
        ]
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Other Data'),
        submenu: [
          {
            label: localizeAppMenu(entryMenuKey, 'Copy Title'),
            click: () => {
              console.log('Copy Title')
            }
          },
          {
            label: localizeAppMenu(entryMenuKey, 'Copy Notes'),
            click: () => {
              console.log('Copy Notes')
            }
          },
          {
            type: 'separator'
          },
          {
            label: localizeAppMenu(entryMenuKey, 'Copy Time-based OTP'),
            accelerator: 'CmdOrCtrl+T',
            click: () => {
              console.log('Copy OTP')
            }
          },
          {
            label: localizeAppMenu(entryMenuKey, 'Show Time-based OTP'),
            accelerator: 'CmdOrCtrl+Shift+T',
            click: () => {
              console.log('Show OTP')
            }
          }
        ]
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Attachments'),
        submenu: [
          {
            label: '...',
            click: () => {
              console.log('Attachments ...')
            }
          }
        ]
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Perform Auto-Type'),
        accelerator: 'CmdOrCtrl+V',
        click: () => {
          console.log('Perform Auto-Type')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Add Entry'),
        accelerator: 'CmdOrCtrl+I',
        click: () => {
          console.log('Add Entry')
        }
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Edit Entry'),
        accelerator: 'Enter',
        click: () => {
          console.log('Edit Entry')
        }
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Duplicate Entry'),
        accelerator: 'CmdOrCtrl+K',
        click: () => {
          console.log('Duplicate Entry')
        }
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Delete Entry'),
        accelerator: 'Delete',
        click: () => {
          console.log('Delete Entry')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(entryMenuKey, 'Select All'),
        accelerator: 'CmdOrCtrl+A'
      }
    ]
  })
}

function setFindMenu(): MenuItem {
  const findMenuKey = 'Find'
  return new MenuItem({
    label: localizeAppMenu(findMenuKey, findMenuKey),
    submenu: [
      {
        label: localizeAppMenu(findMenuKey, 'Find'),
        accelerator: 'CmdOrCtrl+F',
        click: () => {
          console.log('Find')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(findMenuKey, 'Expired'),
        click: () => {
          console.log('Expired')
        }
      },
      {
        label: localizeAppMenu(findMenuKey, 'Expiring in'),
        submenu: [
          {
            label: localizeAppMenu(findMenuKey, '1 day')
          },
          {
            label: localizeAppMenu(findMenuKey, '2 days')
          },
          {
            label: localizeAppMenu(findMenuKey, '3 days')
          },
          {
            label: localizeAppMenu(findMenuKey, '1 week')
          },
          {
            label: localizeAppMenu(findMenuKey, '2 weeks')
          },
          {
            label: localizeAppMenu(findMenuKey, '1 month')
          },
          {
            label: localizeAppMenu(findMenuKey, '2 months')
          },
          {
            type: 'separator'
          },
          {
            label: localizeAppMenu(findMenuKey, 'Future')
          }
        ]
      }
    ]
  })
}

function setViewMenu(): MenuItem {
  const viewMenuKey = 'View'
  return new MenuItem({
    label: localizeAppMenu(viewMenuKey, viewMenuKey),
    submenu: [
      {
        label: localizeAppMenu(viewMenuKey, 'Change Language'),
        click: () => {
          console.log('Change Language')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(viewMenuKey, 'Show Toolbar'),
        click: () => {
          console.log('Toggle Toolbar')
        }
      },
      {
        label: localizeAppMenu(viewMenuKey, 'Show Entry View'),
        click: () => {
          console.log('Show Entry View')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(viewMenuKey, 'Always on top'),
        click: () => {
          console.log('Toggle Always on top')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(viewMenuKey, 'Configure Columns'),
        click: () => {
          console.log('Configure Columns')
        }
      },
      {
        label: localizeAppMenu(viewMenuKey, 'Sort by'),
        submenu: [
          {
            label: localizeAppMenu(viewMenuKey, 'No Sort'),
            click: () => {
              console.log('No Sort')
            }
          },
          {
            type: 'separator'
          },
          {
            label: '...'
          },
          {
            type: 'separator'
          },
          {
            label: localizeAppMenu(viewMenuKey, 'Ascending')
          },
          {
            label: localizeAppMenu(viewMenuKey, 'Descending')
          }
        ]
      }
    ]
  })
}

function setToolsMenu(): MenuItem {
  const toolsMenuKey = 'Tools'
  return new MenuItem({
    label: localizeAppMenu(toolsMenuKey, toolsMenuKey),
    submenu: [
      {
        label: localizeAppMenu(toolsMenuKey, 'Generate Password'),
        click: () => {
          console.log('Generate Password')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(toolsMenuKey, 'Options'),
        click: () => {
          console.log('Options')
        }
      }
    ]
  })
}

function setHelpMenu(): MenuItem {
  const helpMenuKey = 'Help'
  return new MenuItem({
    label: localizeAppMenu(helpMenuKey, helpMenuKey),
    submenu: [
      {
        label: localizeAppMenu(helpMenuKey, 'Help Contents'),
        click: () => {
          console.log('Help contents')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(helpMenuKey, 'Check for Updates'),
        click: () => {
          console.log('Check for Updates')
        }
      },
      {
        type: 'separator'
      },
      {
        label: localizeAppMenu(helpMenuKey, 'About'),
        click: () => {
          console.log('About')
        }
      }
    ]
  })
}