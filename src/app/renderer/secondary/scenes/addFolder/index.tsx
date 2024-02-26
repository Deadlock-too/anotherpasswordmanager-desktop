import { useTranslation } from 'react-i18next'
import { Folder, uuid } from '../../../common/types'
import { Formik } from 'formik'
import TitleBar from '../../../main/components/titlebar'
import { FormikTextInput } from '../../../common/components'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'
import { useFormikLockHandler } from '../../hooks/lockHandler'

const AddFolderScene = ({ formikRef }) => {
  const { t } = useTranslation()

  const handleAddFolder = async (folder: Folder) => {
    await window.electron.events.propagate(EventIdentifiers.AddFolder, folder)
  }

  return (
    <Formik
      initialValues={ { title: '' } }
      validate={ (values) => {
        const errors = {}
        if (values.title === undefined || values.title === '') {
          errors['title'] = t('Common.Validations.Required field')
        }
        return errors
      } }
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          const folder = new Folder(uuid(), values.title)
          handleAddFolder(folder).then(() => {
            setSubmitting(false)
          })
            .then(() => {
              window.close()
            })
        }, 400)
      } }
      onReset={ () => {
        window.close()
      } }
      innerRef={ formikRef }
    >
      { (formik) => (
        <div>
          <h1 className="font-bold text-lg unselectable">{ t('AddFolderDialog.Title') }</h1>
          <div className="pt-3 flex flex-col h-full">
            <form onSubmit={ formik.handleSubmit } className="justify-between">
              <FormikTextInput
                type={ 'text' }
                formik={ formik }
                field="title"
                label={ t('AddFolderDialog.Field Label') }
                placeholder={ t('AddFolderDialog.Field Placeholder') }
                readonly={ false }
                disabled={ formik.isSubmitting }
              />
              <button
                className="btn ml-auto mt-8"
                type="submit"
                disabled={ formik.isSubmitting }
              >
                { t('AddFolderDialog.Submit Button') }
              </button>
            </form>
          </div>
        </div>
      ) }
    </Formik>
  )
}

const AddFolderWindow = () => {
  const { formikRef, handleClose } = useFormikLockHandler()
  const { t } = useTranslation()
  const title = t('AddFolderDialog.Dialog Title')

  return (
    <>
      <TitleBar title={ title } variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6">
        <AddFolderScene formikRef={ formikRef }/>
      </div>
    </>
  )
}

export default AddFolderWindow