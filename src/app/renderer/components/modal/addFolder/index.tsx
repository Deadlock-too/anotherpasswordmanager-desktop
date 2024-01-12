import { useContext } from 'react'
import { FileContentContext, ModalContext } from '../../../contexts'
import Modal from '../index'
import { Formik } from 'formik'
import { uuid } from '../../../types'
import i18n from '../../../../../i18n'
import FormField from '../../formField'

const AddFolderDialog = () => {
  const {
    handleAddFolder,
    handleSelectFolder,
    selectedEntryId,
    selectedFolderId
  } = useContext(FileContentContext)

  const { isAddFolderModalOpen, setIsAddFolderModalOpen } = useContext(ModalContext)

  return (
    <Formik
      initialValues={ { title: '' } }
      validate={ (values) => {
        const errors = {}
        if (values.title === undefined || values.title === '') {
          errors['title'] = i18n.t('Common.Validations.Required field')
        }
        return errors
      } }
      onSubmit={ (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          const folder = {
            Id: uuid(),
            Name: values.title,
            Entries: []
          }
          handleAddFolder(folder)
          handleSelectFolder(folder, selectedEntryId, selectedFolderId)
          setSubmitting(false)
        }, 400)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        document.getElementById('addFolderModal').close()
        setIsAddFolderModalOpen(false)
        resetForm()
      } }
    >
      { (formik) => (
        <Modal
          id="addFolderModal"
          title={ i18n.t('AddFolderDialog.Title') }
          handleReset={ () => {
            formik.handleReset()
            setIsAddFolderModalOpen(false)
          } }
          isModalVisible={ isAddFolderModalOpen }
        >
          <form onSubmit={ formik.handleSubmit } className="justify-between">
            <FormField
              formik={ formik }
              field="title"
              label={ i18n.t('AddFolderDialog.Field Label') }
              placeholder={ i18n.t('AddFolderDialog.Field Placeholder') }
              unselectable={ !isAddFolderModalOpen }
            />
            <button
              className="btn ml-auto mt-8"
              type="submit"
              disabled={ formik.isSubmitting }
              aria-hidden={ !isAddFolderModalOpen }
              tabIndex={ isAddFolderModalOpen ? 0 : -1 }
            >
              { i18n.t('AddFolderDialog.Submit Button') }
            </button>
          </form>
        </Modal>
      ) }
    </Formik>
  )
}

export default AddFolderDialog