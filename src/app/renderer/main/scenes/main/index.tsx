import { useFileContentContext } from '../../../common/contexts'
import FoldersColumn from '../../components/column/foldersColumn'
import EntriesColumn from '../../components/column/entriesColumn'
import DetailsColumn from '../../components/column/detailsColumn'
import Locked from '../locked'
import { useEffect, useState } from 'react'
import { DragHandleVerticalIcon } from '../../../../../assets/icons'
import {
  getPanelElement,
  Panel,
  PanelGroup,
  PanelResizeHandle
} from 'react-resizable-panels'
import { useHandleVisibilityManager, useMinSizeResizingHelper } from '../../../common/hooks/resizablePanels'

const Main = () => {
  const { folders, entries, isLocked } = useFileContentContext()

  const minWidths = [ 150, 150, 260 ]

  const [ minSize, setMinSize ] = useState(minWidths.map(w => w / window.innerWidth * 100))
  const [ detailSize, setDetailSize ] = useState<number>()

  const groupId = 'main-content'
  const folderId = 'folders'
  const entryId = 'entries'
  const detailId = 'detail'

  useMinSizeResizingHelper(minWidths, setMinSize)
  useHandleVisibilityManager(groupId)

  const updateDetailSize = () => {
    const panel = getPanelElement(detailId)
    if (panel)
      setDetailSize(panel.clientWidth)
  }

  useEffect(() => {
    const handleResize = () => {
      updateDetailSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    isLocked ?
      <Locked/> :
      <div className="main-content flex flex-row p-2 h-screen">
        <PanelGroup autoSaveId={ groupId } direction="horizontal" id={ groupId }>
          <Panel id={ folderId } minSize={ minSize[0] } defaultSize={ 25 }>
            <FoldersColumn elements={ folders }/>
          </Panel>
          <PanelResizeHandle className="w-1 divider divider-horizontal ml-0 mr-0 h-full cursor-ew-resize">
            <DragHandleVerticalIcon className="-mt-2 -mb-2"/>
          </PanelResizeHandle>
          <Panel id={ entryId } minSize={ minSize[1] } defaultSize={ 25 }>
            <EntriesColumn elements={ entries }/>
          </Panel>
          <PanelResizeHandle className="w-1 divider divider-horizontal ml-0 mr-0 h-full cursor-ew-resize">
            <DragHandleVerticalIcon className="-mt-2 -mb-2"/>
          </PanelResizeHandle>
          <Panel id={ detailId } minSize={ minSize[2] } defaultSize={ 50 } onResize={ updateDetailSize }>
            <DetailsColumn columnSize={ detailSize }/>
          </Panel>
        </PanelGroup>
      </div>
  )
}

export default Main