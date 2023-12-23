import { useContext, useEffect, useState } from 'react'
import { FileContentContext, SelectionContext } from '../../contexts'
import EntryDetail from '../entryDetail'
import { Entry } from '../../types'

const DetailView = () => {
  const { selectedEntryID } = useContext(SelectionContext)
  const { handleAddEntry, entries } = useContext(FileContentContext)
  const [selectedEntry, setSelectedEntry] = useState<Entry | undefined>(undefined)

  useEffect(() => {
    if (selectedEntryID) {
      const entry = entries.find((entry) => entry.Id === selectedEntryID)
      setSelectedEntry(entry)
    }
  }, [selectedEntryID])

  return (
    selectedEntryID ?
      <EntryDetail entry={selectedEntry ?? { Id: selectedEntryID } as Entry} onSubmit={handleAddEntry}/>
      :
      <div className='h-full justify-center flex flex-col unselectable'>
        <h1 className='text-center font-bold'>No entry selected</h1>
        <h2 className='text-center font-thin pr-5 pl-5'>Select an entry to view its details</h2>
      </div>
  )
}

export default DetailView