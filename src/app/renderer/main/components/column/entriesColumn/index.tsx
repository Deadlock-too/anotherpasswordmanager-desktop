import { ColumnBase, ColumnContentBase } from '../index'
import { Entry } from '../../../../common/types'
import { useFileContentContext, useModalContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'
import { openSecondaryWindow, WindowVariant } from '../../../utils/rendererWindowManager'

const EntriesColumn = ({ elements }) => {
  const {
    selectedFolderId,
    selectedEntryId,
    hoveringEntryId,
    setHoveringEntryId,
    setDeletingEntry,
    editingEntryId,
    setEditingEntryId,
    handleUpdateEntry,
    handleSelectEntry
  } = useFileContentContext()
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()
  const { t } = useTranslation()

  const column = new ColumnBase<Entry>({
    style: {
      label: t('Main.Entries'),
      margin: 'mr-1 ml-1',
      unselectableContent: true,
      addButton: {
        onClick: () => {
          handleSelectEntry(null, true)
        },
        disabled: !selectedFolderId
      }
    },
    children: new ColumnContentBase<Entry>({
      actions: {
        setHoveringId: setHoveringEntryId,
        setDeleting: setDeletingEntry,
        setEditingId: setEditingEntryId,
        handleUpdate: handleUpdateEntry,
        setElementName: (element, name) => element.Name = name,
        showDeletionWindow: async () => {
          await openSecondaryWindow(WindowVariant.EntryDeletion, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
        },
        handleSelection: (entry) => {
          handleSelectEntry(entry, false)
        }
      },
      contextData: {
        selectedId: selectedEntryId,
        hoveringId: hoveringEntryId,
        editingId: editingEntryId,
        getElementName: (entry: Entry) => entry.Name,
        getUniqueElementName: (element, elements) => {
          if (element.Username !== '' && elements.filter(e =>
            e.Id !== element.Id &&
            e.Name === element.Name &&
            e.Username !== element.Username
          ).length > 0) {
            return element.Name + ' (' + element.Username + ')'
          }
          return element.Name
        }
      },
      elements: elements,
      i18n: {
        missingElementsMessage: t('Main.No entries'),
        addElementMessage: t('Main.Add entries')
      }
    }).render()
  })

  return (
    column.render()
  )
}

export default EntriesColumn