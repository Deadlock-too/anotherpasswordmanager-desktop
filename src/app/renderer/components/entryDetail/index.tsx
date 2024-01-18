import { Entry, uuid } from '../../types'
import { usePasswordToggle } from '../../hooks/passwordVisibility'
import { Formik } from 'formik'
import { EyeIcon, EyeSlashIcon } from '../../../../assets/icons'
import { useState } from 'react'
import i18n from '../../../../i18n'
import OTP, { RegExpPattern } from '../otp'
import { useFileContentContext } from '../../contexts'

const EntryDetail = (props: { entry?: Entry, onSubmit: (entry: Entry) => void }) => {
  const { handleSelectEntry, setDeletingEntry, toggleRefreshDetail } = useFileContentContext()
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
          password: props.entry?.Password ?? '',
          otpURI: props.entry?.OTPUri ?? ''
        }
      }
      validate={
        values => {
          const errors: any = {}
          if (!values.title) {
            errors.title = i18n.t('Common.Validations.Required field')
          }

          if (values.otpURI) {
            const regex = new RegExp(RegExpPattern)
            const isMatch = regex.test(values.otpURI)
            if (!isMatch)
              errors.otpURI = i18n.t('Common.Validations.Invalid URI')
          }

          return errors
        }
      }
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          const entry = new Entry(values.id ?? uuid(), values.title, values.username, values.password, values.otpURI)
          props.onSubmit(entry)
          toggleReadonly()
          toggleRefreshDetail()
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
              <div className='join'>
                <input
                  type={ type }
                  name='password'
                  onChange={ handleChange }
                  onBlur={ handleBlur }
                  value={ values.password }
                  placeholder={ i18n.t('Entry Detail.Password Placeholder') }
                  className='input input-sm input-bordered w-full pr-16 rounded-r-none'
                  disabled={ isSubmitting }
                  readOnly={ readonly }
                />
                <button type='button'
                        // className='tooltip tooltip-base-100 absolute top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info focus:tooltip-open' //TODO MANAGE TOOLTIP OVERLAPPING PROBLEM
                        className='relative top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info'
                        disabled={ isSubmitting }
                        title={ passwordVisibility ? i18n.t('Entry Detail.Show Password') : i18n.t('Entry Detail.Hide Password') }
                        // data-tip={ passwordVisibility ? i18n.t('Entry Detail.Show Password') : i18n.t('Entry Detail.Hide Password') }
                        onClick={ () => {
                          handlePasswordVisibility()
                        } }
                >
                  {
                    passwordVisibility ?
                      <EyeIcon/> :
                      <EyeSlashIcon/>
                  }
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
            {
              //(readonly && !values.otpURI) ? null : //Uncomment to hide OTP field
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text font-bold'>
                    { i18n.t('Entry Detail.OTP Label') }
                  </span>
                </div>
                {
                  (readonly) ?
                    (
                      (values.otpURI) ?
                        <OTP otpURI={ values.otpURI }/>
                        :
                        <div className='h-full justify-center'>
                          <h1 className='text-center font-thin unselectable'>
                            { i18n.t('Entry Detail.URI not provided') }
                          </h1>
                        </div>
                    ) :
                    (
                      <>
                        <input
                          type='text'
                          name='otpURI'
                          onChange={ handleChange }
                          onBlur={ handleBlur }
                          value={ values.otpURI }
                          placeholder={ i18n.t('Entry Detail.OTP Placeholder') }
                          className='input input-sm input-bordered w-full'
                          disabled={ isSubmitting }
                          readOnly={ readonly }
                        />
                        {
                          touched ?
                            <div className='label'>
                              <span className='label-text-alt text-error'>{ errors.otpURI }</span>
                            </div>
                            : null
                        }
                      </>
                    )
                }
              </label>
            }
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
                          if (values.id !== undefined) {
                            setDeletingEntry(new Entry(values.id, values.title))
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            window.document.getElementById('entryDeletionModal').showModal()
                            handleReset()
                          }
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