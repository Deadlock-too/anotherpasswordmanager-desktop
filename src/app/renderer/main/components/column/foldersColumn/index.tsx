import { ColumnBase, ColumnContentBase } from '../index'
import { Folder } from '../../../../common/types'
import { useFileContentContext, useModalContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'
import { openSecondaryWindow, WindowVariant } from '../../../utils/rendererWindowManager'

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
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()

  const column = new ColumnBase<Folder>({
    style: {
      label: t('Main.Folders'),
      margin: 'mr-1',
      unselectableContent: true,
      addButton: {
        onClick: async () => {
          await openSecondaryWindow(WindowVariant.AddFolder, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
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
        showDeletionWindow: async () => {
          await openSecondaryWindow(WindowVariant.FolderDeletion, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
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