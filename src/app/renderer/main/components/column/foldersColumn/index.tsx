import { ColumnBase, ColumnContentBase } from '../index'
import { Folder } from '../../../../common/types'
import { useFileContentContext, useModalContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'

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
  } = useFileContentContext()
  const { t } = useTranslation()

  const { setIsAddFolderModalOpen } = useModalContext()

  const column = new ColumnBase<Folder>({
    style: {
      label: t('Main.Folders'),
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
        missingElementsMessage: t('Main.No folders'),
        addElementMessage: t('Main.Add folders')
      }
    }).render()
  })

  return (
    column.render()
  )
}

export default FoldersColumn