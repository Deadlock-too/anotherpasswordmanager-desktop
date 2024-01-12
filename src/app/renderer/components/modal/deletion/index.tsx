import Modal from '../index'
import i18n from '../../../../../i18n'
import { FileContentContext, ModalContext } from '../../../contexts'
import { ReactNode, useContext } from 'react'

interface DeletionModalProps {
  modalId: string
  title: string
  message: ReactNode
  onSubmit: () => void
  onCancel: () => void
}

export const FolderDeletionModal = () => {
  const { handleDeleteFolder, deletingFolder, setDeletingFolder } = useContext(FileContentContext)
  return (
    <DeletionModal
      modalId={ 'folderDeletionModal' }
      title={ i18n.t('DeletionDialog.Folder.Title') }
      message={
        <>
          { i18n.t('DeletionDialog.Folder.Message.Pt1') }
          <a className="underline underline-offset-1 decoration-error decoration-2">{ deletingFolder?.Name }</a>
          { i18n.t('DeletionDialog.Folder.Message.Pt2') }
        </>
      }
      onSubmit={ () => {
        if (deletingFolder)
          handleDeleteFolder(deletingFolder.Id)
      } }
      onCancel={ () => {
        setDeletingFolder(null)
      } }
    />
  )
}

export const EntryDeletionModal = () => {
  const { handleDeleteEntry, deletingEntry, setDeletingEntry } = useContext(FileContentContext)
  return (
    <DeletionModal
      modalId={ 'entryDeletionModal' }
      title={ i18n.t('DeletionDialog.Entry.Title') }
      message={
        <>
          { i18n.t('DeletionDialog.Entry.Message.Pt1') }
          <a className="underline underline-offset-1 decoration-error decoration-2">{ deletingEntry?.Title }</a>
          { i18n.t('DeletionDialog.Entry.Message.Pt2') }
        </>
      }
      onSubmit={ () => {
        if (deletingEntry)
          handleDeleteEntry(deletingEntry.Id)
      } }
      onCancel={ () => {
        setDeletingEntry(null)
      } }
    />
  )
}

const DeletionModal = (props: DeletionModalProps) => {
  const { isDeletionModalOpen, setIsDeletionModalOpen } = useContext(ModalContext)

  return (
    <Modal
      id={ props.modalId }
      title={ props.title }
      handleReset={ () => setIsDeletionModalOpen(false) }
      isModalVisible={ isDeletionModalOpen }
    >
      <p className="text-center pt-4 pb-8 unselectable">
        { props.message }
      </p>
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-neutral ml-2"
          onClick={ () => {
            props.onCancel()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.document.getElementById(props.modalId).close()
            setIsDeletionModalOpen(false)
          } }
        >
          { i18n.t('DeletionDialog.Cancel Button') }
        </button>
        <button
          className="btn btn-error"
          onClick={ () => {
            props.onSubmit()
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window.document.getElementById(props.modalId).close()
            setIsDeletionModalOpen(false)
          } }
        >
          { i18n.t('DeletionDialog.Submit Button') }
        </button>
      </div>
    </Modal>
  )
}