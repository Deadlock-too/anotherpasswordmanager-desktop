import { useContext } from 'react'
import { FileContentContext } from '../../../contexts'
import Modal from '../index'
import { Formik } from 'formik'
import { uuid } from '../../../types'

const AddFolderDialog = () => {
  const {
    handleAddFolder,
    handleSelectFolder,
    selectedEntryId,
    selectedFolderId
  } = useContext(FileContentContext)

  return (
    <Modal id="addFolderModal" title="Add Folder">
      <Formik
        initialValues={ { title: '' } }
        validate={(values) => {
          const errors = {}
          if (values.title === undefined || values.title === '') {
            errors['title'] = 'Required'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
          resetForm()
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          // handleReset
        }) => (
          <form onSubmit={handleSubmit} className="justify-between">
            <label className="form-control w-full mb-4">
              <div className="label">
                <span className="label-text">Enter folder name</span>
              </div>
              <input
                type="text"
                name="title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
                placeholder="Title"
                className="input input-sm input-bordered w-full"
                disabled={isSubmitting}
              />
              {
                touched ?
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.title}</span>
                  </div>
                  : null
              }
            </label>
            <button className="btn ml-auto" type="submit">Add Folder</button>
          </form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddFolderDialog