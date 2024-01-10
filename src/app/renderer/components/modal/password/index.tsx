import { useContext } from 'react'
import { FileContentContext, ModalContext } from '../../../contexts'
import { Formik, FormikProps } from 'formik'
import Modal from '../index'
import i18n from '../../../../../i18n'
import FormField from '../../formField'

interface PasswordDialogProps {
  variant: 'open' | 'create' | 'update'
}

interface InnerDialogProps {
  formik: FormikProps<any>
  isPasswordModalOpen: boolean
}

const OpenPasswordDialog = (props: InnerDialogProps) => {
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        formik={ props.formik }
        field="password"
        label={ i18n.t('PasswordDialog.Open.Password Label') }
        placeholder={ i18n.t('PasswordDialog.Open.Password Placeholder') }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 0 : -1 }
      >
        { i18n.t('PasswordDialog.Open.Submit Button') }
      </button>
    </form>
  )
}

const CreatePasswordDialog = (props: InnerDialogProps) => {
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        formik={ props.formik }
        field="password"
        label={ i18n.t('PasswordDialog.Create.Password Label') }
        placeholder={ i18n.t('PasswordDialog.Create.Password Placeholder') }
      />
      <FormField
        formik={ props.formik }
        field="confirmPassword"
        label={ i18n.t('PasswordDialog.Create.Confirm Label') }
        placeholder={ i18n.t('PasswordDialog.Create.Confirm Placeholder') }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 0 : -1 }
      >
        { i18n.t('PasswordDialog.Create.Submit Button') }
      </button>
    </form>
  )
}

const UpdatePasswordDialog = (props: InnerDialogProps) => {
  return (
    <form onSubmit={ props.formik.handleSubmit } className="justify-between">
      <FormField
        formik={ props.formik }
        field="password"
        label={ i18n.t('PasswordDialog.Update.Password Label') }
        placeholder={ i18n.t('PasswordDialog.Update.Password Placeholder') }
      />
      <FormField
        formik={ props.formik }
        field="confirmPassword"
        label={ i18n.t('PasswordDialog.Update.Confirm Label') }
        placeholder={ i18n.t('PasswordDialog.Update.Confirm Placeholder') }
      />
      <button
        className="btn ml-auto mt-8"
        type="submit"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ !props.isPasswordModalOpen }
        tabIndex={ props.isPasswordModalOpen ? 0 : -1 }
      >
        { i18n.t('PasswordDialog.Update.Submit Button') }
      </button>
    </form>
  )
}

const PasswordDialog = (props: PasswordDialogProps) => {
  const { setPassword, setIsInitialized } = useContext(FileContentContext)
  const { isPasswordModalOpen, setIsPasswordModalOpen } = useContext(ModalContext)

  const dialogTitle = () => {
    switch (props.variant) {
      case 'open':
        return i18n.t('PasswordDialog.Open.Title')
      case 'create':
        return i18n.t('PasswordDialog.Create.Title')
      case 'update':
        return i18n.t('PasswordDialog.Update.Title')
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
    <Formik initialValues={ { password: '' } }
            validate={ (values) => {
              const errors = {}
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
                window.electron.sendPasswordResult(values.password)
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