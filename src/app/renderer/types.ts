export type FileStoreData = {
  fileContent?: File
  currentFileFolders: Folder[]
  selectedFolderIndex?: number
  selectedFolderEntries: Entry[]
  selectedEntryIndex?: number
  selectedEntryData?: Entry
}

export type File = {
  Folders: Folder[]
}

export type Folder = {
  Id: UUID
  Name: string
  Entries: Entry[]
}

export type Entry = {
  Id: UUID
  Title?: string
  Username?: string
  Password?: string
}

export type UUID = string

export { v4 as uuid } from 'uuid'