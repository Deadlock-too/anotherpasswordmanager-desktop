import { ColumnBase, ColumnContentBase } from '../index'
import { useContext } from 'react'
import { FileContentContext, ModalContext } from '../../../contexts'
import { Folder } from '../../../types'
import i18n from '../../../../../i18n'

const FoldersColumn = ({elements}) => {
  const {
    selectedEntryId,
    selectedFolderId,
    hoveringFolderId,
    setHoveringFolderId,
    setDeletingFolder,
    editingFolderId,
    setEditingFolderId,
    handleUpdateFolder,
    handleSelectFolder
  } = useContext(FileContentContext)

  const { setIsAddFolderModalOpen } = useContext(ModalContext)

  const column = new ColumnBase<Folder>({
    style: {
      label: 'Folders',
      width: 'w-3/12',
      margin: 'mr-1',
      unselectableContent: true,
      addButton: {
        onClick: () => {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          document.getElementById('addFolderModal').showModal()
          setIsAddFolderModalOpen(true)
        },
        disabled: false
      }
    },
    children: new ColumnContentBase<Folder>({
      actions: {
        setHoveringId: setHoveringFolderId,
        setDeleting: setDeletingFolder,
        setEditingId: setEditingFolderId,
        handleUpdate: handleUpdateFolder,
        setElementName: (element, name) => element.Name = name,
        showDeletionModal: () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          document.getElementById('folderDeletionModal').showModal()
        },
        handleSelection: (folder) => {
          handleSelectFolder(folder, selectedEntryId, selectedFolderId)
        }
      },
      contextData: {
        selectedId: selectedFolderId,
        hoveringId: hoveringFolderId,
        editingId: editingFolderId,
        getElementName: (folder: Folder) => folder.Name,
        getUniqueElementName: (element) => element.Name,
      },
      elements: elements,
      i18n: {
        missingElementsMessage: i18n.t('Main.No folders'),
        addElementMessage: i18n.t('Main.Add folders')
      }
    }).render()
  })

  return (
    column.render()
  )
}

export default FoldersColumn