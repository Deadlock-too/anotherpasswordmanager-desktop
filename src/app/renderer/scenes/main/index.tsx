import { useContext } from 'react'
import Column from '../../components/column'
import DetailView from '../../components/detailView'
import { FileContentContext, ModalContext } from '../../contexts'
import i18n from '../../../../i18n'

const Main = () => {
  const {
    folders,
    entries,
    handleSelectEntry,
    handleSelectFolder
  } = useContext(FileContentContext)
  const { setIsAddFolderModalOpen } = useContext(ModalContext)

  return (
    <div className='main-content flex flex-row justify-between p-2 items-center h-screen'>
      <Column
        label={i18n.t('Main.Folders')}
        width='w-3/12'
        variant='folders'
        unselectableContent={ true }
        elements={ folders }
        onSelectFolder={ handleSelectFolder }
        onAddEntry={ () => {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          document.getElementById('addFolderModal').showModal()
          setIsAddFolderModalOpen(true)
        } }
      />
      <Column
        label={i18n.t('Main.Entries')}
        width='w-3/12'
        variant='entries'
        unselectableContent={ true }
        elements={ entries }
        onSelectEntry={ (entry) => handleSelectEntry(entry, false) }
        onAddEntry={ () => handleSelectEntry(null, true) }
      />
      <Column
        label={i18n.t('Main.Detail')}
        width='w-6/12'
        variant='detail'
        unselectableContent={ false }
      >
        <DetailView/>
      </Column>
    </div>
  )
}

export default Main