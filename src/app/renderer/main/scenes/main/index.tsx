import { useFileContentContext } from '../../../common/contexts'
import FoldersColumn from '../../components/column/foldersColumn'
import EntriesColumn from '../../components/column/entriesColumn'
import DetailsColumn from '../../components/column/detailsColumn'
import Locked from '../locked'

const Main = () => {
  const {
    folders,
    entries,
    isLocked
  } = useFileContentContext()

  return (
      isLocked ?
        <Locked /> :
        <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
          <FoldersColumn elements={ folders }/>
          <EntriesColumn elements={ entries }/>
          <DetailsColumn/>
        </div>
  )
}

export default Main