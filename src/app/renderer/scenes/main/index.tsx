import { useContext } from 'react'
import Column from '../../components/column'
import DetailView from '../../components/detailView'
import { FileContentContext } from '../../contexts'
import AddFolderDialog from '../../components/modal/addFolder'

const Main = () => {
  const {
    folders,
    entries,
    handleSelectEntry,
    handleSelectFolder
  } = useContext(FileContentContext)

  return (
    <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
      <AddFolderDialog/>
      <Column
        label="Folders"
        width="w-3/12"
        variant="folders"
        unselectableContent={ true }
        elements={ folders }
        onSelectFolder={ handleSelectFolder }
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        onAddEntry={ () => document.getElementById('addFolderModal').showModal() }
      />
      <Column
        label="Entries"
        width="w-3/12"
        variant="entries"
        unselectableContent={ true }
        elements={ entries }
        onSelectEntry={ (entry) => handleSelectEntry(entry, false) }
        onAddEntry={ () => handleSelectEntry(null, true) }
      />
      <Column
        label="Detail"
        width="w-6/12"
        variant="detail"
        unselectableContent={ false }
      >
        <DetailView/>
      </Column>
    </div>
  )
}

export default Main