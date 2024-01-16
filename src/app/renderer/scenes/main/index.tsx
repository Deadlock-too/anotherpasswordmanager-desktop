import { useContext } from 'react'
import { FileContentContext } from '../../contexts'
import FoldersColumn from '../../components/column/foldersColumn'
import EntriesColumn from '../../components/column/entriesColumn'
import DetailsColumn from '../../components/column/detailsColumn'

const Main = () => {
  const {
    folders,
    entries,
  } = useContext(FileContentContext)

  return (
    <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
      <FoldersColumn elements={ folders }/>
      <EntriesColumn elements={ entries }/>
      <DetailsColumn/>
    </div>
  )
}

export default Main