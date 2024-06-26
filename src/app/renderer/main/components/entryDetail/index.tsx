import { Entry, uuid } from '../../../common/types'
import { Formik } from 'formik'
import { useState } from 'react'
import OTP, { RegExpPattern } from '../otp'
import { useConfigContext, useFileContentContext, useModalContext } from '../../../common/contexts'
import { useTranslation } from 'react-i18next'
import { FormikPasswordInput, FormikTextInput } from '../../../common/components'
import { openSecondaryWindow, WindowVariant } from '../../utils/rendererWindowManager'
import { CheckIcon, CrossIcon, PencilIcon, TrashIcon } from '../../../../../assets/icons'

const EntryDetail = (props: { columnSize: number, entry?: Entry, onSubmit: (entry: Entry) => void }) => {
  const { handleSelectEntry, setDeletingEntry, toggleRefreshDetail } = useFileContentContext()
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()
  const [ readonly, setReadonly ] = useState(props.entry !== undefined)
  const { t } = useTranslation()
  const toggleReadonly = () => {
    setReadonly(readonly => !readonly)
  }

  const { config } = useConfigContext()
  const copiableFields = config.settings.security.copyFieldValuesToClipboardOnClick

  return (
    <Formik
      initialValues={
        {
          id: props.entry?.Id,
          title: props.entry?.Name ?? '',
          username: props.entry?.Username ?? '',
          password: props.entry?.Password ?? '',
          otpURI: props.entry?.OTPUri ?? ''
        }
      }
      validate={
        values => {
          const errors: any = {}
          if (!values.title) {
            errors.title = t('Common.Validations.Required field')
          }

          if (values.otpURI) {
            const regex = new RegExp(RegExpPattern)
            const isMatch = regex.test(values.otpURI)
            if (!isMatch)
              errors.otpURI = t('Common.Validations.Invalid URI')
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
      { (formik) => (
        <form onSubmit={ formik.handleSubmit } className="flex flex-col justify-between h-full px-10 py-5">
          <div className="flex flex-col gap-2">
            <FormikTextInput
              type={ 'text' }
              label={ t('Entry Detail.Title Label') }
              field="title"
              placeholder={ t('Entry Detail.Title Placeholder') }
              formik={ formik }
              readonly={ readonly }
              disabled={ formik.isSubmitting }
              copiableContent={ copiableFields }
              copyTooltipLabel={ t('Entry Detail.Title Copied') }
            />
            <FormikTextInput
              type={ 'text' }
              label={ t('Entry Detail.Username Label') }
              field="username"
              placeholder={ t('Entry Detail.Username Placeholder') }
              formik={ formik }
              readonly={ readonly }
              disabled={ formik.isSubmitting }
              copiableContent={ copiableFields }
              copyTooltipLabel={ t('Entry Detail.Username Copied') }
            />
            <FormikPasswordInput
              label={ t('Entry Detail.Password Label') }
              field="password"
              placeholder={ t('Entry Detail.Password Placeholder') }
              formik={ formik }
              readonly={ readonly }
              disabled={ formik.isSubmitting }
              tooltipHiddenLabel={ t('Entry Detail.Show Password') }
              tooltipVisibleLabel={ t('Entry Detail.Hide Password') }
              copiableContent={ copiableFields }
              copyTooltipLabel={ t('Entry Detail.Password Copied') }
            />
            {
              //(readonly && !formik.values.otpURI) ? null : //Uncomment to hide OTP field
              <FormikTextInput
                type={ 'text' }
                label={ t('Entry Detail.OTP Label') }
                field="otpURI"
                placeholder={ t('Entry Detail.OTP Placeholder') }
                formik={ formik }
                readonly={ readonly }
                disabled={ formik.isSubmitting }
                copiableContent={ false }
                preventDefaultOnClick={ readonly }
                customReadonlyComponent={
                  (formik.values.otpURI) ?
                    <OTP otpURI={ formik.values.otpURI } columnSize={ props.columnSize }/>
                    :
                    <div className="h-full justify-center">
                      <h1 className="text-center font-thin unselectable">
                        { t('Entry Detail.URI not provided') }
                      </h1>
                    </div>
                }
              />
            }
          </div>
          <div className="flex flex-row w-full justify-between pt-12 pb-5">
            {
              readonly ?
                <button
                  type="button"
                  className="btn btn-outline w-1/3"
                  onClick={ (event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    toggleReadonly()
                  } }
                  disabled={ formik.isSubmitting }
                >
                  <PencilIcon/>
                  {
                    props.columnSize > 450 ?
                      t('Entry Detail.Edit Button') : null
                  }
                </button>
                :
                <button
                  type="submit"
                  disabled={ formik.isSubmitting }
                  className="btn btn-primary btn-outline w-1/3"
                >
                  <CheckIcon/>
                  {
                    props.columnSize > 450 ?
                      t('Entry Detail.Save Button') : null
                  }
                </button>
            }
            {
              readonly ?
                <button
                  type="button"
                  disabled={ formik.isSubmitting }
                  className="btn btn-error w-1/3"
                  onClick={ async () => {
                    if (formik.values.id !== undefined) {
                      setDeletingEntry(new Entry(formik.values.id, formik.values.title))
                      await openSecondaryWindow(WindowVariant.EntryDeletion, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
                      formik.handleReset()
                    }
                  } }
                >
                  <TrashIcon/>
                  {
                    props.columnSize > 450 ?
                      t('Entry Detail.Delete Button') : null
                  }
                </button>
                :
                <button
                  type="reset"
                  disabled={ formik.isSubmitting }
                  className="btn btn-outline w-1/3"
                  onClick={ () => {
                    if (formik.values.id !== undefined) {
                      formik.handleReset()
                      toggleReadonly()
                    } else {
                      formik.handleReset()
                      handleSelectEntry(null, false)
                    }
                  } }
                >
                  <CrossIcon/>
                  {
                    props.columnSize > 450 ?
                      t('Entry Detail.Cancel Button') : null
                  }
                </button>
            }
          </div>
        </form>
      ) }
    </Formik>
  )
}

export default EntryDetail