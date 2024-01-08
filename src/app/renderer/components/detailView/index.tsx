import { useContext, useEffect, useState } from 'react'
import { FileContentContext } from '../../contexts'
import EntryDetail from '../entryDetail'
import { Entry } from '../../types'
import i18n from '../../../../i18n'

const DetailView = () => {
  const {
    selectedEntryId,
    selectedFolderId,
    handleAddEntry,
    handleUpdateEntry,
    handleSelectEntry,
    entries
  } = useContext(FileContentContext)
  const [ selectedEntry, setSelectedEntry ] = useState<Entry | undefined>(undefined)

  useEffect(() => {
    if (selectedEntryId) {
      const entry = entries.find((entry) => entry.Id === selectedEntryId)
      setSelectedEntry(entry)
    }
  }, [ selectedEntryId ])

  return (
    selectedFolderId && selectedEntryId ?
      <EntryDetail
        key={ selectedEntry?.Id }
        entry={ selectedEntry }
        onSubmit={ (entry) => {
          if (selectedEntry === undefined) {
            handleAddEntry(entry, selectedFolderId)
          }
          else {
            handleUpdateEntry(entry)
          }
          handleSelectEntry(entry, false)
        } }
      />
      :
      <div className='h-full justify-center flex flex-col unselectable'>
        <h1 className='text-center font-bold'>{i18n.t('Main.No Entry Selected')}</h1>
        <h2 className='text-center font-thin pr-5 pl-5'>{i18n.t('Main.Entry Detail')}</h2>
      </div>
  )
}

export default DetailView