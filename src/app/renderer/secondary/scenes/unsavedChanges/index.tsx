import { useTranslation } from 'react-i18next'
import TitleBar from '../../../main/components/titlebar'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'
import { useFileNameHelper } from '../../hooks/fileNameHelper'
import { useLockHandler } from '../../hooks/lockHandler'
import { AppStateValues } from '../../../../../types'
import { AppState } from '../../../../../utils/appStateUtils'
import { capitalizeFirstLetter } from '../../../../../utils'

const UnsavedChangesScene = (props: IUnsavedChangesWindowProps) => {
  const { t } = useTranslation()

  const title = t(`UnsavedChangesDialog.Title`)
  const message = t(`UnsavedChangesDialog.${ capitalizeFirstLetter(props.variant) }.Message`)

  const afterPropagation = async () => {
    await window.app.state.get()
      .then(state => {
        if (props.variant === 'close' && new AppState(state).has(AppStateValues.Closing)) {
          window.app.state.close(true)
        }
      })
      .then(window.close)
  }

  const saveChanges = async (selection: boolean) => {
    await window.electron.events.propagate(EventIdentifiers.SaveChanges, selection)
      .then(afterPropagation)
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
          onClick={ () => saveChanges(true) }
        >
          { t('UnsavedChangesDialog.Save Button') }
        </button>
        <button
          type="button"
          className="btn btn-error w-24"
          onClick={ () => saveChanges(false) }
        >
          { t('UnsavedChangesDialog.Discard Button') }
        </button>
      </div>
    </div>
  )
}

interface IUnsavedChangesWindowProps {
  variant: 'open' | 'close'
}

const UnsavedChangesWindow = (props: IUnsavedChangesWindowProps) => {
  const { t } = useTranslation()
  const { fileName } = useFileNameHelper()
  const { handleClose } = useLockHandler(async () =>
    (async () => {
      if (props.variant === 'close') {
        await window.app.state.close(false)
      }
    })().then(window.close)
  )

  const title = t(`UnsavedChangesDialog.Dialog Title`) + ' - ' + fileName

  return (
    <>
      <TitleBar title={ title } variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6 pb-6">
        <UnsavedChangesScene { ...props } />
      </div>
    </>
  )
}

export default UnsavedChangesWindow