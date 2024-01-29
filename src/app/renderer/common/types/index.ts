export type FileStoreData = {
  fileContent?: File
  currentFileFolders: Folder[]
  selectedFolderIndex?: number
  selectedFolderEntries: Entry[]
  selectedEntryIndex?: number
  selectedEntryData?: Entry
}

export type File = {
  AppVersion: string
  Folders: Folder[]
}

export type IdentifiableType = {
  Id: UUID
}

export class Folder implements IdentifiableType {
  Id: UUID
  Name: string
  Entries: Entry[]

  constructor(id: UUID, name: string, entries?: Entry[]) {
    this.Id = id
    this.Name = name
    this.Entries = entries ?? []
  }
}

export class Entry implements IdentifiableType {
  Id: UUID
  Title: string
  Username?: string
  Password?: string
  OTPUri?: string

  constructor(id: UUID, title: string, username?: string, password?: string, otpUri?: string) {
    this.Id = id
    this.Title = title
    this.Username = username
    this.Password = password
    this.OTPUri = otpUri
  }
}

export type UUID = string

export { v4 as uuid } from 'uuid'