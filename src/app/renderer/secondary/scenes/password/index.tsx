import TitleBar from '../../../main/components/titlebar'
import { Formik, FormikProps } from 'formik'
import { RefObject } from 'react'
import { useTranslation } from 'react-i18next'
import { FormikTextInput } from '../../../common/components'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'
import { capitalizeFirstLetter } from '../../../../../utils'
import { useFileNameHelper } from '../../hooks/fileNameHelper'
import { useFormikLockHandler } from '../../hooks/lockHandler'

interface IPasswordSceneProps extends IPasswordWindowProps {
  formikRef: RefObject<FormikProps<any>>
}

const UnlockPasswordVariant = (props: { formik: FormikProps<any> }) => {
  const { t } = useTranslation()
  return (
    <>
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Unlock.Password Label') }
        placeholder={ t('PasswordDialog.Unlock.Password Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <div className="mt-8">
        <button
          className="btn ml-auto"
          type="submit"
          disabled={ props.formik.isSubmitting }
        >
          { t('PasswordDialog.Unlock.Submit Button') }
        </button>
      </div>
    </>
  )
}

const OpenPasswordVariant = (props: { formik: FormikProps<any> }) => {
  const { t } = useTranslation()
  return (
    <>
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Open.Password Label') }
        placeholder={ t('PasswordDialog.Open.Password Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <div className="mt-8">
        <button
          className="btn ml-auto"
          type="submit"
          disabled={ props.formik.isSubmitting }
        >
          { t('PasswordDialog.Open.Submit Button') }
        </button>
      </div>
    </>
  )
}

const CreatePasswordVariant = (props: { formik: FormikProps<any> }) => {
  const { t } = useTranslation()
  return (
    <>
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Create.Password Label') }
        placeholder={ t('PasswordDialog.Create.Password Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="confirmPassword"
        label={ t('PasswordDialog.Create.Confirm Label') }
        placeholder={ t('PasswordDialog.Create.Confirm Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <div className="flex flex-row justify-between gap-2 items-center mt-8">
        <button
          className="btn"
          type="submit"
          disabled={ props.formik.isSubmitting }
        >
          { t('PasswordDialog.Create.Submit Button') }
        </button>
        {
          props.formik.errors['form'] && typeof props.formik.errors['form'] === 'string' ?
            <div className="label">
              <span className="text-error text-xs">{ props.formik.errors['form'] }</span>
            </div>
            : null
        }
      </div>
    </>
  )
}

const UpdatePasswordVariant = (props: { formik: FormikProps<any> }) => {
  const { t } = useTranslation()
  return (
    <>
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Update.Password Label') }
        placeholder={ t('PasswordDialog.Update.Password Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <FormikTextInput
        type="password"
        formik={ props.formik }
        field="confirmPassword"
        label={ t('PasswordDialog.Update.Confirm Label') }
        placeholder={ t('PasswordDialog.Update.Confirm Placeholder') }
        readonly={ false }
        disabled={ props.formik.isSubmitting }
      />
      <div className="flex flex-row justify-between gap-2 items-center mt-8">
        <button
          className="btn"
          type="submit"
          disabled={ props.formik.isSubmitting }
        >
          { t('PasswordDialog.Update.Submit Button') }
        </button>
        {
          props.formik.errors['form'] && typeof props.formik.errors['form'] === 'string' ?
            <div className="label">
              <span className="text-error text-xs">{ props.formik.errors['form'] }</span>
            </div>
            : null
        }
      </div>
    </>
  )
}

const PasswordScene = (props: IPasswordSceneProps) => {
  const { t } = useTranslation()

  const setPassword = async (password: string) => {
    await window.electron.events.propagate(EventIdentifiers.SetPassword, password)
      .then(() => {
        if (props.variant === 'open') {
          window.electron.events.propagate(EventIdentifiers.SetFileContent, password)
        }

        if (props.variant === 'create') {
          window.electron.events.propagate(EventIdentifiers.SetInitialized)
        }
      })
  }

  const unlock = async (password: string) => {
    await window.electron.events.propagate(EventIdentifiers.Unlock, password)
  }

  const FormVariant = (formik: FormikProps<any>) => {
    switch (props.variant) {
      case 'open':
        return <OpenPasswordVariant formik={ formik }/>
      case 'create':
        return <CreatePasswordVariant formik={ formik }/>
      case 'update':
        return <UpdatePasswordVariant formik={ formik }/>
      case 'unlock':
        return <UnlockPasswordVariant formik={ formik }/>
    }
  }

  return (
    <Formik
      initialValues={ { password: '', confirmPassword: '' } }
      validate={ (values) => {
        const errors = {}
        if (props.variant === 'create' || props.variant === 'update') {
          if (values.password !== values.confirmPassword) {
            errors['confirmPassword'] = t('Common.Validations.ValuesMustMatch')
          }

          if (values.password.length === 0 && values.confirmPassword.length === 0) {
            errors['form'] = t('Common.Validations.Fields cannot be empty')
          }
        }
        return errors
      } }
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          let executingFunc: (password: string) => Promise<void>

          if (props.variant === 'unlock') {
            executingFunc = unlock
          } else {
            executingFunc = setPassword
          }

          executingFunc(values.password)
            .then(() => setSubmitting(false))
            .then(window.close)

        }, 400)
      } }
      onReset={ () => {
        window.close()
      } }
      innerRef={ props.formikRef }
    >
      { (formik) => (
        <div>
          <h1 className="font-bold text-lg unselectable">
            { t(`PasswordDialog.${ capitalizeFirstLetter(props.variant) }.Title`) }
          </h1>
          <div className="pt-3 flex flex-col h-full">
            <form onSubmit={ formik.handleSubmit } onReset={ formik.handleReset } className="justify-between">
              <FormVariant { ...formik }/>
            </form>
          </div>
        </div>
      ) }
    </Formik>
  )
}

interface IPasswordWindowProps {
  variant: 'open' | 'create' | 'update' | 'unlock'
}

const PasswordWindow = (props: IPasswordWindowProps) => {
  const { t } = useTranslation()
  const { fileName, openingFileName } = useFileNameHelper()
  const { formikRef, handleClose } = useFormikLockHandler()
  const useFileName = props.variant === 'open' || props.variant === 'unlock'
  const title = t(`PasswordDialog.${ capitalizeFirstLetter(props.variant) }.Dialog Title`) + (useFileName ? ` - ${ props.variant === 'open' ? openingFileName : fileName }` : '')

  return (
    <>
      <TitleBar title={ title } variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6 pb-6">
        <PasswordScene variant={ props.variant } formikRef={ formikRef }/>
      </div>
    </>
  )
}


export default PasswordWindow