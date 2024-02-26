import { useEffect, useRef } from 'react'
import IpcEventNames from '../../../main/ipc/ipcEventNames'
import { FormikProps } from 'formik'

export const useLockHandler = (handleClose: () => void) => {
  useEffect(() => {
    window.electron.events.subscribe(IpcEventNames.App.Lock, handleClose)

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.Lock)
    }
  }, [])

  return { handleClose }
}

export const useFormikLockHandler = () => {
  const formikRef = useRef<FormikProps<any>>(null)
  const handleClose = () => {
    formikRef.current?.resetForm()
  }

  useLockHandler(handleClose)

  return { formikRef, handleClose }
}