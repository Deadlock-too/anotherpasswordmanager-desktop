import { Entry, uuid } from '../../types'
import { usePasswordToggle } from '../../hooks/passwordVisibility'
import { Formik } from 'formik'
import { EyeIcon } from '../../../../assets/icons'

const EntryDetail = (props: { entry: Entry, onSubmit: (entry: Entry) => void }) => {
  const { type, passwordVisibility, handlePasswordVisibility } = usePasswordToggle()
  return (
    <Formik
      initialValues={
        {
          id: props.entry?.Id ?? uuid(),
          title: props.entry?.Title,
          username: props.entry?.Username,
          password: props.entry?.Password
        }
      }
      // validate={} //Think about validations
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          props.onSubmit({
            Id: values.id,
            Title: values.title,
            Username: values.username,
            Password: values.password
          })
          setSubmitting(false)
        }, 400)
      }}
    >
      {({
        values,
        // errors,
        // touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        handleReset
      }) => (
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full px-10 py-5">
          <div className="flex flex-col">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Title</span>
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
            </label>
            <div className="p-2"/>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                name="username"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.username}
                placeholder="Username"
                className="input input-sm input-bordered w-full"
                disabled={isSubmitting}
              />
            </label>
            <div className="p-2"/>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <div className="relative">
                <input
                  type={type}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Password"
                  className="input input-sm input-bordered w-full pr-16"
                  disabled={isSubmitting}
                />
                <button type="button"
                        className="tooltip tooltip-base-100 absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info focus:tooltip-open"
                        disabled={isSubmitting}
                        data-tip={passwordVisibility ? 'Show password' : 'Hide password'}
                        onClick={() => {
                          handlePasswordVisibility()
                        }}
                >
                  <EyeIcon/>
                </button>
              </div>
            </label>
          </div>
          <div className="flex flex-row w-full justify-between pt-12 pb-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-outline w-1/3"
            >
              Save
            </button>
            <button
              type="reset"
              disabled={isSubmitting}
              className="btn btn-outline w-1/3"
              onClick={handleReset}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Formik>
  )
}

export default EntryDetail