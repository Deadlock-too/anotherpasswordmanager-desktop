import { useTranslation } from 'react-i18next'
import TitleBar from '../../../main/components/titlebar'
import { useEffect } from 'react'
import IpcEventNames from '../../../../main/ipc/ipcEventNames'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'

const UnsavedChangesScene = () => {
  const { t } = useTranslation()

  const title = t(`UnsavedChangesDialog.Title`)
  const message = t(`UnsavedChangesDialog.Message`)

  const onSave = async () => {
    await window.electron.events.propagate(EventIdentifiers.SaveChanges,true)
      .then(window.close)
  }

  const onDiscard = async () => {
    await window.electron.events.propagate(EventIdentifiers.SaveChanges, false)
      .then(window.close)
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <h1 className="font-bold text-lg unselectable">{ title }</h1>
      <p className="text-center pt-4 pb-8 unselectable">
        { message }
      </p>
      <div className="flex flex-row justify-end items-center gap-2">
        <button
          type="button"
          className="btn btn-primary w-24"
          onClick={ onSave }
        >
          { t('UnsavedChangesDialog.Save Button') }
        </button>
        <button
          type="button"
          className="btn btn-error w-24"
          onClick={ onDiscard }
        >
          { t('UnsavedChangesDialog.Discard Button') }
        </button>
      </div>
    </div>
  )
}

const UnsavedChangesWindow = () => {
  const handleClose = () => {
    window.close()
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
        <UnsavedChangesScene/>
      </div>
    </>
  )
}

export default UnsavedChangesWindow