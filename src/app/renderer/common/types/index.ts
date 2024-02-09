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

export type NamedIdentifiableType = IdentifiableType & {
  Name: string
}

export class Folder implements NamedIdentifiableType {
  Id: UUID
  Name: string
  Entries: Entry[]

  constructor(id: UUID, name: string, entries?: Entry[]) {
    this.Id = id
    this.Name = name
    this.Entries = entries ?? []
  }
}

export class Entry implements NamedIdentifiableType {
  Id: UUID
  Name: string
  Username?: string
  Password?: string
  OTPUri?: string

  constructor(id: UUID, title: string, username?: string, password?: string, otpUri?: string) {
    this.Id = id
    this.Name = title
    this.Username = username
    this.Password = password
    this.OTPUri = otpUri
  }
}

export enum RecordType {
  Folder = 'Folder',
  Entry = 'Entry'
}

export type UUID = string

export { v4 as uuid } from 'uuid'