import { ColumnBase, ColumnContentBase } from '../index'
import { Entry } from '../../../../common/types'
import { useFileContentContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'

const EntriesColumn = ({elements}) => {
  const {
    selectedEntryId,
    hoveringEntryId,
    setHoveringEntryId,
    setDeletingEntry,
    editingEntryId,
    setEditingEntryId,
    handleUpdateEntry,
    handleSelectEntry
  } = useFileContentContext()
  const { t } = useTranslation()

  const column = new ColumnBase<Entry>({
    style: {
      label: t('Main.Entries'),
      width: 'w-3/12',
      margin: 'mr-1 ml-1',
      unselectableContent: true,
      addButton: {
        onClick: () => { handleSelectEntry(null, true) },
        disabled: false
      }
    },
    children: new ColumnContentBase<Entry>({
      actions: {
        setHoveringId: setHoveringEntryId,
        setDeleting: setDeletingEntry,
        setEditingId: setEditingEntryId,
        handleUpdate: handleUpdateEntry,
        setElementName: (element, name) => element.Title = name,
        showDeletionModal: () => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          document.getElementById('entryDeletionModal').showModal()
        },
        handleSelection: (entry) => {
          handleSelectEntry(entry, false)
        }
      },
      contextData: {
        selectedId: selectedEntryId,
        hoveringId: hoveringEntryId,
        editingId: editingEntryId,
        getElementName: (entry: Entry) => entry.Title,
        getUniqueElementName: (element, elements) => {
          if (elements.filter(e => e.Id !== element.Id && e.Title === element.Title).length > 0) {
            return element.Title + ' (' + element.Username + ')'
          }
          return element.Title
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