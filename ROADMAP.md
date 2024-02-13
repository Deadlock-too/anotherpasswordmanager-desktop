# Project Roadmap

## Currently planned features for 1.0.0 release
### Missing features

#### Priority implementations
- [ ] **[ID-0]** Implement missing settings already defined
  - [ ] Implement general settings 
    - [x] **[ID-0.1]** Implement open at startup
    - [x] **[ID-0.2]** Implement open minimized
    - [x] **[ID-0.3]** Implement minimize to tray
    - [x] **[ID-0.4]** Implement close to tray
    - [x] **[ID-0.5]** Implement autoSave
    - [ ] ~~**[ID-0.6]** Implement autoSaveTime~~
  - [ ] Implement security settings
    - [ ] **[ID-0.7]** Implement autoLock
    - [ ] **[ID-0.8]** Implement autoLockTime
    - [ ] **[ID-0.9]** Implement autoLockOnMinimize
    - [ ] **[ID-0.10]** Implement autoLockOnSleep
    - [ ] **[ID-0.15]** Implement autoLockOnTray
    - [ ] **[ID-0.11]** Implement autoCleanClipboard
    - [ ] **[ID-0.12]** Implement autoCleanClipboardTime
    - [ ] **[ID-0.13]** Implement defaultNewEntryExpire
    - [ ] **[ID-0.14]** Implement defaultNewEntryExpireTime
- [ ] **[ID-1]** Define app icon
- [ ] **[ID-2]** Define default file name for the password file
- [ ] **[ID-4]** Manage protocol links in dedicated class
- [ ] **[ID-5]** Add confirm dialog for app closure if there are unsaved changes
- [ ] **[ID-6]** Code cleanup in main.ts moving code to dedicated classes
- [ ] **[ID-7]** Code cleanup in main/app.tsx moving all event subscriptions to dedicated class
- [ ] **[ID-8]** General code cleanup
- [ ] **[ID-10]** Fix missing improvements
- [ ] **[ID-13]** Check for useless re-renders
- [ ] **[ID-14]** If the form is submitted, then reset, then re-opened, the form has the previous values
- [ ] **[ID-15]** Merge similar components
- [ ] **[ID-16]** Make intro centered. If the text in the second button is too long the divider is not centered
- [ ] **[ID-25]** Create utils file for easier access to app-wide utility functions
- [ ] Implement unit testing for existing components
- [ ] Good written documentation


#### Move to Done once completed
- [ ] Add hinter on how does the minimize/close to tray work
- [ ] **[ID-3]** Manage darwin platform dynamic title bar height (low priority as not testable without a device with Darwin platform)
- [ ] **[ID-9]** Manage aliases for easier imports and better code readability
- [ ] **[ID-11]** Add compatibility checks for the app and file content conversion
- [ ] **[ID-12]** Add menu similar to JetBrain's apps
- [ ] **[ID-17]** If file is already open, before opening a new one ask
- [ ] **[ID-18]** Check for file changes and eventually update the state from the file content after asking the user
- [ ] **[ID-19]** In settings update theme immediately without needing to apply or submit for better user experience
- [ ] **[ID-20]** Make consts file for easier access to app-wide constants
- [ ] **[ID-21]** Add a button to the settings to reset the app to the default settings
- [ ] **[ID-22]** On settings apply, update not only theme and language but also other settings
- [ ] **[ID-23]** On settings reset, reset all applied settings
- [ ] **[ID-24]** Use library like os-locale to get the user's locale and set initial language
- [ ] Design and add intro animation on open
- [ ] Entry improvements:
  - [ ] Different entry types (login, credit card, secure note, etc.)
  - [ ] Entry expiry:
    - [ ] Expiry notification
    - [ ] Expiry management
  - [ ] Entry search
  - [ ] Entry sorting
  - [ ] Entry filtering
  - [ ] Entry grouping
  - [ ] Entry tagging
  - [ ] Custom entry fields
  - [ ] Entry history and it's management
  - [ ] Entry history tree view
  - [ ] Allow file attachment to entries
- [ ] Password generation
    - [ ] Password generation customization
- [ ] Password strength checker
- [ ] Dashboard (default)
- [ ] Think about a smart way to import otp qr codes
- [ ] If file has no password, don't ask for it
- [ ] Make column width resizable
- [ ] Add opening file name to the title of the open dialog
- [ ] Improve tray menu
  - [ ] Add bookmarks to enable tray menu access to certain entries
- [ ] Add shortcuts
  - [ ] Add shortcuts for common actions
  - [ ] Add shortcuts for custom actions
- [ ] Customizable dashboard with widgets
- [ ] Add setting to delete file after a number of failed attempts trying to unlock the file or opening it. Include a warning about the possible loss of data and make it overridable per single file. Save hashes of the files that don't want to be deleted to prevent accidental deletion and prevent brute force attacks by simply removing from the hash list. Think about how to make unmodifiable counter of failed attempts.
- [ ] Auto-update
- [ ] Browser extensions
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Edge
  - [ ] Safari
  - [ ] Opera
- [ ] Support
- [ ] Mobile app
- [ ] Web app

### Done
- [x] Basic entry management (creation, deletion, editing)
- [x] OTP field
- [x] File Encryption
- [x] Localization
- [x] Entry field values copying to clipboard
- [x] Themes

## Possible future features (not yet planned)
### Custom theme creation
This feature would allow users to create their own themes by customizing colors, fonts, and other visual elements. Maybe a possible online store for sharing themes.
### Auto-fill
This feature would automatically fill in the user's credentials on websites and applications, saving them the trouble of manually entering their details.
- [ ] TODO
### Secure Sharing
This feature would allow users to securely share certain passwords with trusted contacts. Even allowing for the creation of temporary passwords for sharing. That will change when the access is revoked.
- [ ] TODO
### Backups
This feature would allow users to create and manage backups of their password data. This could include options for local backups, cloud backups, and scheduled backups.
- [ ] TODO
### Two-Factor Authentication (2FA)
This adds an extra layer of security to the password manager. The user would need to provide two different authentication factors to verify themselves before they can access their passwords.
- [ ] TODO
### Biometric Authentication
This could be an additional or alternative way to access the password manager. Biometric data like fingerprints or facial recognition can be used.
- [ ] TODO
### Emergency Access
This feature would allow users to designate trusted individuals who can request access to their passwords in case of an emergency.
- [ ] TODO
### Password Breach Alerts
The password manager could monitor various databases of leaked credentials and alert the user if any of their passwords have been compromised.
- [ ] TODO
### Cross-Platform Support
The password manager could be made available on various platforms (Windows, macOS, Linux, Android, iOS) and all data should be synced across these platforms.
- [ ] TODO
### Import/Export Feature
Users should be able to import their passwords from other password managers or browsers and export their passwords for backup purposes.
- [ ] TODO
### Password Inheritance
This feature would allow users to designate who will receive their passwords in the event of their death.
- [ ] TODO
### Password Audit
This feature would periodically review the user's passwords and provide recommendations for improving their security. This could include suggestions for using stronger passwords, removing duplicate passwords, and updating old passwords.
- [ ] TODO
### Password Recovery
This feature would provide a secure method for users to recover their passwords if they forget them. This could involve a combination of security questions, email verification, and other methods.
- [ ] TODO
### Password Change Automation
This feature would automatically change the user's passwords on supported websites and applications. This can help to ensure that passwords are regularly updated without requiring the user to manually change them.
- [ ] TODO
### Password Online Hosting
This feature would allow users to store their passwords securely in the cloud, providing access from anywhere with an internet connection.
- [ ] TODO
### API
This feature would provide an API for the password manager. This could allow other applications to interact with the password manager, potentially leading to a wider range of features and integrations.
- [ ] TODO
### Plugins
This feature would allow developers to create plugins for the password manager. This could allow for a wide range of additional features and customizations, depending on the needs and preferences of the user.
- [ ] TODO
### System Widgets
This feature would provide widgets that users can add to their device's home screen. These could provide quick access to certain features of the password manager, such as generating a new password, checking the security dashboard, etc.
- [ ] TODO
### Community Features
This feature would provide a platform for users to interact with each other, ask questions, share tips, etc. This could help to build a community around the password manager and provide additional support for users.
- [ ] TODO
### Awards/Gamification
This feature would provide rewards and achievements for users who demonstrate good security practices. This could help to encourage users to improve their security habits and make the password manager more engaging to use.
- [ ] TODO
### Dark Web Monitoring
This feature would monitor the dark web for any signs of the user's personal information or credentials being traded or sold. If any such activity is detected, the user would be alerted immediately.
- [ ] TODO