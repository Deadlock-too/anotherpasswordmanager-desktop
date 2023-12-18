import { Component, useState } from 'react'
import { EyeIcon } from '../../../../assets/icons'
import { Formik } from 'formik'

interface ColumnProps {
  label: string | undefined
  width: 'w-3/12' | 'w-6/12'
  unselectableContent?: boolean
  variant?: 'folders' | 'entries' | 'detail',
  elements?: any[]
}

const Detail2 = () => {
  return (
    // <div className="flex flex-col h-full bg-base-300">
    <div className="flex flex-col h-full">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Title</span>
        </div>
        <input type="text" placeholder="Title" className="input input-sm input-bordered w-full"/>
      </label>
      <div className="p-2"/>
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Username</span>
        </div>
        <input type="text" placeholder="Username" className="input input-sm input-bordered w-full"/>
      </label>
      <div className="p-2"/>

      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">Password</span>
        </div>
        <div className="relative">
          <input
            type="password"
            placeholder="Password"
            className="input input-sm input-bordered w-full pr-16"
          />
          <button className="absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info" onClick={
            () => {
              console.log('click')
            }
          }>
            <EyeIcon/>
          </button>
        </div>
      </label>
    </div>
  )
}

const Detail = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Formik
      initialValues={
        {
          title: undefined,
          username: undefined,
          password: undefined,
        }
      }
      // validate={} //Think about validations
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          console.log(JSON.stringify(values, null, 2))
          setSubmitting(false)
        }, 400)
      }}
      onReset={(values, { setSubmitting }) => {
        setTimeout(() => {
          values.title = undefined
          values.username = undefined
          values.password = undefined
          setSubmitting(false)
        }, 200)
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
                  type={showPassword ? "text" : "password"}
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
                        data-tip={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => {
                          setShowPassword(!showPassword)
                        }}
                >
                  <EyeIcon/>
                </button>
              </div>
            </label>
          </div>

          <div className="flex flex-row w-full justify-between pt-12">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-outline"
            >
              Save
            </button>
            <button
              type="reset"
              disabled={isSubmitting}
              className="btn btn-outline"
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

const Column = ({
  label = undefined,
  width = 'w-3/12',
  unselectableContent = true,
  variant = undefined,
  elements = undefined
}: ColumnProps) => {
  let margin: string | undefined = undefined
  if (variant === 'folders') {
    margin = 'mr-1'
  } else if (variant === 'entries') {
    margin = 'mr-1 ml-1'
  } else if (variant === 'detail') {
    margin = 'ml-1'
  }

  return (
    <div className={`${width} ${margin} h-full flex flex-col ${unselectableContent ? 'unselectable' : ''}`}>
      <label className={`${unselectableContent ? '' : 'unselectable'}`}>
        {label}
      </label>
      <div className="divider m-0"/>
      <div className="bg-base-200 w-full flex-grow h-full rounded p-2">
        {
          variant === 'detail' ?
            <Detail/> :
            elements === undefined ||
            elements?.length === 0 ?
              <label className="text-center">
                No {variant} found
              </label> :
              elements.map((child) => {
                return (
                  <div className="bg-base-300 w-full rounded py-0.5 px-1.5">
                    {child}
                  </div>
                )
              })
        }
      </div>
    </div>
  )
}

export default class Main extends Component {
  render() {
    return (
      <div className="main-content flex flex-row justify-between p-2 items-center h-screen">
        <Column
          label="Folders"
          width="w-3/12"
          variant="folders"
          unselectableContent={true}
        />
        <Column
          label="Entries"
          width="w-3/12"
          variant="entries"
          unselectableContent={true}
        />
        <Column
          label="Detail"
          width="w-6/12"
          variant="detail"
          unselectableContent={false}
        />
      </div>
    )
  }
}