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

export type NamedType = {
  Id: UUID
  Text: string
}

export class Folder implements NamedType {
  Id: UUID
  Text: string
  Name: string
  Entries: Entry[]

  constructor(id: UUID, name: string, entries?: Entry[]) {
    this.Id = id
    this.Name = name
    this.Entries = entries ?? []

    this.Text = this.Name
  }
}

export class Entry implements NamedType {
  Id: UUID
  Text: string
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

    this.Text = this.Title
  }
}

export type UUID = string

export { v4 as uuid } from 'uuid'