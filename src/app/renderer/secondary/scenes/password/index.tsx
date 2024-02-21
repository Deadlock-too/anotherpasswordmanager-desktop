import TitleBar from '../../../main/components/titlebar'
import { Formik, FormikProps } from 'formik'
import { RefObject, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FormikTextInput } from '../../../common/components'
import IpcEventNames from '../../../../main/ipc/ipcEventNames'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'
import { capitalizeFirstLetter } from '../../../../../utils'

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
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
      >
        { t('PasswordDialog.Unlock.Submit Button') }
      </button>
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
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
      >
        { t('PasswordDialog.Open.Submit Button') }
      </button>
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
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
      >
        { t('PasswordDialog.Create.Submit Button') }
      </button>
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
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
      >
        { t('PasswordDialog.Update.Submit Button') }
      </button>
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
        }
        return errors
      } }
      onSubmit={ (values, { setSubmitting }) => {
        setTimeout(() => {
          // Declare the function that will be subsequently assigned
          let executingFunc = async (password: string) => {
            /* empty func */
          }

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
  const formikRef = useRef<FormikProps<any>>(null)
  const handleClose = () => {
    formikRef.current?.resetForm()
  }

  useEffect(() => {
    window.electron.events.subscribe(IpcEventNames.App.Lock, handleClose)

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.Lock)
    }
  }, [])

  return (
    <>
      <TitleBar variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6 pb-6">
        <PasswordScene variant={ props.variant } formikRef={ formikRef }/>
      </div>
    </>
  )
}


export default PasswordWindow