import { Formik, FormikProps } from 'formik'
import Modal from '../index'
import { useFileContentContext, useModalContext } from '../../../../common/contexts'
import FormField from '../../../../main/components/formField'
import { useTranslation } from 'react-i18next'

interface PasswordDialogProps {
  variant: 'open' | 'create' | 'update'
}

interface InnerDialogProps {
  formik: FormikProps<any>
  isPasswordModalOpen: boolean
}

const OpenPasswordDialog = (props: InnerDialogProps) => {
  const { t } = useTranslation()
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        type='password'
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Open.Password Label') }
        placeholder={ t('PasswordDialog.Open.Password Placeholder') }
        unselectable={ !props.isPasswordModalOpen }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 1 : -1 }
      >
        { t('PasswordDialog.Open.Submit Button') }
      </button>
    </form>
  )
}

const CreatePasswordDialog = (props: InnerDialogProps) => {
  const { t } = useTranslation()
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        type='password'
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Create.Password Label') }
        placeholder={ t('PasswordDialog.Create.Password Placeholder') }
        unselectable={ !props.isPasswordModalOpen }
      />
      <FormField
        type='password'
        formik={ props.formik }
        field="confirmPassword"
        label={ t('PasswordDialog.Create.Confirm Label') }
        placeholder={ t('PasswordDialog.Create.Confirm Placeholder') }
        unselectable={ !props.isPasswordModalOpen }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 1 : -1 }
      >
        { t('PasswordDialog.Create.Submit Button') }
      </button>
    </form>
  )
}

const UpdatePasswordDialog = (props: InnerDialogProps) => {
  const { t } = useTranslation()
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        type='password'
        formik={ props.formik }
        field="password"
        label={ t('PasswordDialog.Update.Password Label') }
        placeholder={ t('PasswordDialog.Update.Password Placeholder') }
        unselectable={ !props.isPasswordModalOpen }
      />
      <FormField
        type='password'
        formik={ props.formik }
        field="confirmPassword"
        label={ t('PasswordDialog.Update.Confirm Label') }
        placeholder={ t('PasswordDialog.Update.Confirm Placeholder') }
        unselectable={ !props.isPasswordModalOpen }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 1 : -1 }
      >
        { t('PasswordDialog.Update.Submit Button') }
      </button>
    </form>
  )
}

const PasswordDialog = (props: PasswordDialogProps) => {
  const { setPassword, setIsInitialized, filePath } = useFileContentContext()
  const { isPasswordModalOpen, setIsPasswordModalOpen } = useModalContext()
  const { t } = useTranslation()

  const dialogTitle = () => {
    switch (props.variant) {
      case 'open':
        return t('PasswordDialog.Open.Title')
      case 'create':
        return t('PasswordDialog.Create.Title')
      case 'update':
        return t('PasswordDialog.Update.Title')
    }
  }

  const FormVariant = (formik: FormikProps<any>) => {
    switch (props.variant) {
      case 'open':
        return <OpenPasswordDialog formik={ formik } isPasswordModalOpen={ isPasswordModalOpen }/>
      case 'create':
        return <CreatePasswordDialog formik={ formik } isPasswordModalOpen={ isPasswordModalOpen }/>
      case 'update':
        return <UpdatePasswordDialog formik={ formik } isPasswordModalOpen={ isPasswordModalOpen }/>
      default:
        return null
    }
  }

  return (
    <Formik initialValues={ { password: '', confirmPassword: '' } }
            validate={ (values) => {
              const errors = {}
              if (props.variant === 'create' || props.variant === 'update') {
                if (values.password !== values.confirmPassword){
                  errors['confirmPassword'] = t('Common.Validations.ValuesMustMatch')
                }
              }
              return errors
            } }
            onSubmit={ (values, { setSubmitting, resetForm }) => {
              setTimeout(() => {
                setPassword(values.password)
                setSubmitting(false)
              }, 400)

              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              document.getElementById(props.variant + 'PasswordModal').close()
              setIsPasswordModalOpen(false)
              resetForm()

              if (props.variant === 'open')
                // window.electron.sendPasswordResult(values.password)
                window.electron.setFileContent(filePath, values.password)
              if (props.variant === 'create')
                setIsInitialized(true)
            } }
    >
      { (formik) => (
        <Modal
          id={ props.variant + 'PasswordModal' }
          title={ dialogTitle() }
          handleReset={ () => {
            formik.handleReset()
            setIsPasswordModalOpen(false)
          } }
          isModalVisible={ isPasswordModalOpen }
        >
          <FormVariant { ...formik } />
        </Modal>
      ) }
    </Formik>
  )
}

export default PasswordDialog