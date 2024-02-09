import { useTranslation } from 'react-i18next'
import { Folder, uuid } from '../../../common/types'
import { Formik, FormikProps } from 'formik'
import { ContextProvider } from '../../../common/contexts/contextProvider'
import TitleBar from '../../../main/components/titlebar'
import { useRef } from 'react'
import { FormikTextInput } from '../../../common/components'

const AddFolderScene = ({ formikRef }) => {
  const { t } = useTranslation()

  const handleAddFolder = async (folder: Folder) => {
    await window.dialogManagement.addFolder(folder)
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
      onSubmit={ (values, { setSubmitting, resetForm }) => {
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

const InternalAddFolder = () => {
  const formikRef = useRef<FormikProps<any>>(null)
  const handleClose = () => {
    formikRef.current?.resetForm()
  }

  return (
    <>
      <TitleBar variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6">
        <AddFolderScene formikRef={ formikRef }/>
      </div>
    </>
  )
}

const AddFolderWindow = () => {
  return (
    <ContextProvider>
      <InternalAddFolder/>
    </ContextProvider>
  )
}

export default AddFolderWindow