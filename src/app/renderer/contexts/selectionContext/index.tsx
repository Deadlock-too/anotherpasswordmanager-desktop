import React, { createContext, useCallback, useState } from 'react'
import { UUID } from '../../types'

interface SelectionContextState {
  resetSelection: () => void
  selectedEntryID: UUID | null
  selectedFolderID: UUID | null
  handleSelectEntry: (id: UUID | null) => void
  handleSelectFolder: (id: UUID | null) => void
}

export const SelectionContext = createContext<SelectionContextState>({} as SelectionContextState)

export function SelectionContextProvider({ children }) {
  const [selectedFolderID, handleSelectFolder] = useState<UUID | null>(null)
  const [selectedEntryID, handleSelectEntry] = useState<UUID | null>(null)
  const resetSelection = useCallback(() => {
    handleSelectEntry(null)
    handleSelectFolder(null)
  }, [])
  const context: SelectionContextState = {
    resetSelection,
    selectedEntryID,
    selectedFolderID,
    handleSelectEntry,
    handleSelectFolder
  }
  return (
    <SelectionContext.Provider value={context}>
      {children}
    </SelectionContext.Provider>
  )
}