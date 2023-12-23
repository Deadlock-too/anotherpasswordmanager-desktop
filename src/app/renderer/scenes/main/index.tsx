import { useContext } from 'react'
import { Folder, uuid } from '../../types'
import Column from '../../components/column'
import Modal from '../../components/modal'
import DetailView from '../../components/detailView'
import { Formik } from 'formik'
import { FileContentContext, SelectionContext } from '../../contexts'

const AddFolderDialog = (props: { onSubmit: (folder: Folder) => void }) => {
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
            props.onSubmit({
              Id: uuid(),
              Name: values.title,
              Entries: []
            })
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

const Main = () => {
  const {
    folders,
    entries,
    // setFolders,
    // setEntries,
    // handleAddEntry,
    handleAddFolder,
    // handleRemoveEntry,
    // handleRemoveFolder,
  } = useContext(FileContentContext)
  const {
    handleSelectEntry,
    handleSelectFolder,
    // selectedEntryID,
    // selectedFolderID,
  } = useContext(SelectionContext)

  return (
    <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
      <AddFolderDialog onSubmit={handleAddFolder}/>
      <Column
        label="Folders"
        width="w-3/12"
        variant="folders"
        unselectableContent={true}
        elements={folders}
        onSelectFolder={handleSelectFolder}
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        onAddEntry={() => document.getElementById('addFolderModal').showModal()}
      />
      <Column
        label="Entries"
        width="w-3/12"
        variant="entries"
        unselectableContent={true}
        elements={entries}
        onSelectEntry={handleSelectEntry}
        onAddEntry={() => handleSelectEntry(uuid())}
      />
      <Column
        label="Detail"
        width="w-6/12"
        variant="detail"
        unselectableContent={false}
      >
        <DetailView/>
      </Column>
    </div>
  )
}


export default Main