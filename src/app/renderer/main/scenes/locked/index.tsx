import { DoorOpenIcon, KeyIcon, ShieldCheckIcon } from '../../../../../assets/icons'
import { useTranslation } from 'react-i18next'
import { useFileContentContext, useModalContext } from '../../../common/contexts'
import { openSecondaryWindow, WindowVariant } from '../../utils/rendererWindowManager'
import { useEffect } from 'react'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'

const Locked = () => {
  const { t } = useTranslation()
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()
  const { unsavedChanges, password, setIsLocked, reset } = useFileContentContext()

  const onExit = async () => {
    if (unsavedChanges) {
      await openSecondaryWindow(WindowVariant.UnsavedChangesClose, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
    } else {
      reset()
    }
  }

  const onUnlock = async () => {
    await openSecondaryWindow(WindowVariant.PasswordUnlock, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
  }

  useEffect(() => {
    const unlockHandler = async (pwd: string) => {
      if (pwd === password) {
        setIsLocked(false)
      } else {
        await openSecondaryWindow(WindowVariant.FailedUnlock, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
      }
    }
    window.electron.events.subscribe(EventIdentifiers.Unlock, unlockHandler)

    return () => {
      window.electron.events.unsubscribe(EventIdentifiers.Unlock)
    }
  }, [ password ])

  return (
    <div className="main-content flex items-center justify-center p-4">
      <div className="grid gap-16 text-center">
        <div className="space-y-8">
          <ShieldCheckIcon className="mx-auto text-6xl text-success"/>
          <div className="text-lg font-semibold">{ t('Locked.Message') }</div>
        </div>
        <div className="space-x-8">
          <button className="btn btn-md btn-outline w-36" onClick={ onUnlock }>
            <KeyIcon/>
            { t('Locked.Unlock') }
          </button>
          <button className="btn btn-md btn-outline w-36" onClick={ onExit }>
            <DoorOpenIcon/>
            { t('Locked.Exit') }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Locked