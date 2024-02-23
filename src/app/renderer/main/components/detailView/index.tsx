import { useEffect, useState } from 'react'
import EntryDetail from '../entryDetail'
import { Entry } from '../../../common/types'
import { useFileContentContext } from '../../../common/contexts'
import { useTranslation } from 'react-i18next'

const DetailView = ({ columnSize }) => {
  const {
    selectedEntryId,
    selectedFolderId,
    handleAddEntry,
    handleUpdateEntry,
    handleSelectEntry,
    entries,
    refreshDetail
  } = useFileContentContext()
  const { t } = useTranslation()
  const [ selectedEntry, setSelectedEntry ] = useState<Entry | undefined>(undefined)

  useEffect(() => {
    if (selectedEntryId) {
      const entry = entries.find((entry) => entry.Id === selectedEntryId)
      setSelectedEntry(entry)
    }
  }, [ selectedEntryId, refreshDetail ])

  return (
    selectedFolderId && selectedEntryId ?
      <EntryDetail
        key={ JSON.stringify(selectedEntry) }
        entry={ selectedEntry }
        columnSize={ columnSize }
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
        <h1 className='text-center font-bold'>{t('Main.No Entry Selected')}</h1>
        <h2 className='text-center font-thin pr-5 pl-5'>{t('Main.Entry Detail')}</h2>
      </div>
  )
}

export default DetailView