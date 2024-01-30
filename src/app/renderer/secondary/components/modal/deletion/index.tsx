import Modal from '../index'
import { ReactNode } from 'react'
import { useFileContentContext, useModalContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'

interface DeletionModalProps {
  modalId: string
  title: string
  message: ReactNode
  onSubmit: () => void
  onCancel: () => void
}

export const FolderDeletionModal = () => {
  const { handleDeleteFolder, deletingFolder, setDeletingFolder } = useFileContentContext()
  const { t } = useTranslation()
  return (
    <DeletionModal
      modalId={ 'folderDeletionModal' }
      title={ t('DeletionDialog.Folder.Title') }
      message={
        <>
          { t('DeletionDialog.Folder.Message.Pt1') }
          <a className="underline underline-offset-1 decoration-error decoration-2">{ deletingFolder?.Name }</a>
          { t('DeletionDialog.Folder.Message.Pt2') }
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
  const { handleDeleteEntry, deletingEntry, setDeletingEntry } = useFileContentContext()
  const { t } = useTranslation()
  return (
    <DeletionModal
      modalId={ 'entryDeletionModal' }
      title={ t('DeletionDialog.Entry.Title') }
      message={
        <>
          { t('DeletionDialog.Entry.Message.Pt1') }
          <a className="underline underline-offset-1 decoration-error decoration-2">{ deletingEntry?.Title }</a>
          { t('DeletionDialog.Entry.Message.Pt2') }
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
  const { isDeletionModalOpen, setIsDeletionModalOpen } = useModalContext()
  const { t } = useTranslation()

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
          { t('DeletionDialog.Cancel Button') }
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
          { t('DeletionDialog.Submit Button') }
        </button>
      </div>
    </Modal>
  )
}