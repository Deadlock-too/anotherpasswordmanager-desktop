import { Entry, uuid } from '../../types'
import { usePasswordToggle } from '../../hooks/passwordVisibility'
import { Formik } from 'formik'
import { EyeIcon } from '../../../../assets/icons'
import { useContext, useState } from 'react'
import { FileContentContext } from '../../contexts'
import i18n from '../../../../i18n'

const EntryDetail = (props: { entry?: Entry, onSubmit: (entry: Entry) => void }) => {
  const { handleSelectEntry, handleDeleteEntry } = useContext(FileContentContext)
  const { type, passwordVisibility, handlePasswordVisibility } = usePasswordToggle()
  const [ readonly, setReadonly ] = useState(props.entry !== undefined)

  const toggleReadonly = () => {
    setReadonly(readonly => !readonly)
  }

  return (
    <Formik
      initialValues={
        {
          id: props.entry?.Id,
          title: props.entry?.Title ?? '',
          username: props.entry?.Username ?? '',
          password: props.entry?.Password ?? ''
        }
      }
      validate={
        values => {
          const errors: any = {}
          if (!values.title) {
            errors.title = i18n.t('Common.Validations.Required field')
          }
          return errors
        }
      } //Think about validations
      onSubmit={ (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
          const entry: Entry = {
            Id: values.id ?? uuid(),
            Title: values.title,
            Username: values.username,
            Password: values.password
          }
          props.onSubmit(entry)
          toggleReadonly()
          setSubmitting(false)
        }, 400)
      } }
    >
      { ({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        handleReset,
      }) => (
        <form onSubmit={ handleSubmit } className='flex flex-col justify-between h-full px-10 py-5'>
          <div className='flex flex-col'>
            {
              // <label className='form-control w-full'>
              //   <div className='label'>
              //     <span className='label-text font-bold'>ID</span>
              //   </div>
              //   <div className='label'>
              //     <span className='label-text'>{ values.id }</span>
              //   </div>
              // </label>
              // <div className='p-2'/>
            }
            <label className='form-control w-full' onClick={ () => {
              if (readonly && values.title !== undefined)
                window.clipboard.write(values.title)
            } }>
              <div className='label'>
                <span className='label-text font-bold'>
                  { i18n.t('Entry Detail.Title Label') }
                </span>
              </div>
              <input
                type='text'
                name='title'
                onChange={ handleChange }
                onBlur={ handleBlur }
                value={ values.title }
                placeholder={ i18n.t('Entry Detail.Title Placeholder') }
                className='input input-sm input-bordered w-full'
                disabled={ isSubmitting }
                readOnly={ readonly }
              />
              {
                touched ?
                  <div className='label'>
                    <span className='label-text-alt text-error'>{ errors.title }</span>
                  </div>
                  : null
              }
            </label>
            <label className='form-control w-full' onClick={ () => {
              if (readonly && values.username !== undefined)
                window.clipboard.write(values.username)
            } }>
              <div className='label'>
                <span className='label-text font-bold'>
                  { i18n.t('Entry Detail.Username Label') }
                </span>
              </div>
              <input
                type='text'
                name='username'
                onChange={ handleChange }
                onBlur={ handleBlur }
                value={ values.username }
                placeholder={ i18n.t('Entry Detail.Username Placeholder') }
                className='input input-sm input-bordered w-full'
                disabled={ isSubmitting }
                readOnly={ readonly }
              />
              {
                touched ?
                  <div className='label'>
                    <span className='label-text-alt text-error'>{ errors.username }</span>
                  </div>
                  : null
              }
            </label>
            <label className='form-control w-full' onClick={ () => {
              if (readonly && values.password !== undefined)
                window.clipboard.write(values.password)
            } }>
              <div className='label'>
                <span className='label-text font-bold'>
                  { i18n.t('Entry Detail.Password Label') }
                </span>
              </div>
              <div className='relative'>
                <input
                  type={ type }
                  name='password'
                  onChange={ handleChange }
                  onBlur={ handleBlur }
                  value={ values.password }
                  placeholder={ i18n.t('Entry Detail.Password Placeholder') }
                  className='input input-sm input-bordered w-full pr-16'
                  disabled={ isSubmitting }
                  readOnly={ readonly }
                />
                <button type='button'
                        // className='tooltip tooltip-base-100 absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info focus:tooltip-open' //TODO MANAGE TOOLTIP PROBLEM
                        className='absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info'
                        disabled={ isSubmitting }
                        title={ passwordVisibility ? i18n.t('Entry Detail.Show Password') : i18n.t('Entry Detail.Hide Password')}
                        // data-tip={ passwordVisibility ? i18n.t('Entry Detail.Show Password') : i18n.t('Entry Detail.Hide Password') }
                        onClick={ () => {
                          handlePasswordVisibility()
                        } }
                >
                  <EyeIcon/>
                </button>
              </div>
              {
                touched ?
                  <div className='label'>
                    <span className='label-text-alt text-error'>{ errors.password }</span>
                  </div>
                  : null
              }
            </label>
          </div>
          <div className='flex flex-row w-full justify-between pt-12 pb-5'>
            {
              readonly ?
                <button type='button'
                        className='btn btn-outline w-1/3'
                        onClick={ (event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          toggleReadonly()
                        } }
                        disabled={ isSubmitting }
                >
                  { i18n.t('Entry Detail.Edit Button') }
                </button>
                :
                <button type='submit'
                        disabled={ isSubmitting }
                        className='btn btn-primary btn-outline w-1/3'
                >
                  { i18n.t('Entry Detail.Save Button') }
                </button>
            }
            {
              readonly ?
                <button type='button'
                        disabled={ isSubmitting }
                        className='btn btn-error w-1/3'
                        onClick={ () => {
                          //TODO ADD CONFIRMATION
                          handleDeleteEntry(values.id!)
                          handleReset()
                          handleSelectEntry(null, false)
                        } }
                >
                  { i18n.t('Entry Detail.Delete Button') }
                </button>
                :
                <button type='reset'
                        disabled={ isSubmitting }
                        className='btn btn-outline w-1/3'
                        onClick={ () => {
                          if (values.id !== undefined) {
                            handleReset()
                            toggleReadonly()
                          } else {
                            handleReset()
                            handleSelectEntry(null, false)
                          }
                        } }
                >
                  { i18n.t('Entry Detail.Cancel Button') }
                </button>
            }
          </div>
        </form>
      ) }
    </Formik>
  )
}

export default EntryDetail