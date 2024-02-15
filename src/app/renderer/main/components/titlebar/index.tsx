import { CloseIcon, LockIcon, SaveIcon, SettingsIcon, TemporaryAppIcon, UpdateIcon } from '../../../../../assets/icons'
import { encrypt } from '../../../../main/utils/crypt'
import { useFileContentContext, useModalContext } from '../../../common/contexts'
import { ReactNode } from 'react'
import { openSecondaryWindow, WindowVariant } from '../../utils/rendererWindowManager'

const TitleBarButton = ({ icon, onClick }: { icon: ReactNode, onClick: () => void }) => {
  return (
    <button
      className="titlebar-icon btn btn-xs btn-square btn-ghost"
      onClick={ onClick }
    >
      { icon }
    </button>
  )
}

const SaveButton = () => {
  const { filePath, setFilePath, fileContent, password, forceUpdateFileContent } = useFileContentContext()
  const saveFile = () => {
    const saveFile = (path: string, content: string) => {
      window.electron.saveFile(path, content)
    }

    let content = JSON.stringify(fileContent)
    if (password) {
      content = encrypt(content, password)
    }

    if (filePath) {
      forceUpdateFileContent()
      return
    } else {
      window.dialog.fileManagement.save()
        .then((path: string | undefined) => {
          if (!path) {
            return
          }
          setFilePath(path)
        })
        .then(() => {
          if (filePath)
            saveFile(filePath, content)
        })
    }
  }
  return (
    <TitleBarButton
      icon={ <SaveIcon/> }
      onClick={ saveFile }
    />
  )
}

const ChangeMasterKeyButton = () => {
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()
  return (
    <TitleBarButton
      icon={ <UpdateIcon/> }
      onClick={ async () => {
        await openSecondaryWindow(WindowVariant.PasswordUpdate, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
      } }
    />
  )
}

const CloseButton = ({ onClick }) => {
  return (
    <TitleBarButton
      icon={ <CloseIcon/> }
      onClick={ onClick }
    />
  )
}

const LockButton = () => {
  const { setIsLocked } = useFileContentContext()
  return (
    <TitleBarButton
      icon={ <LockIcon /> }
      onClick={ () => setIsLocked(true) }
    />
  )
}

const SettingsButton = () => {
  const { secondaryWindowEntry, setIsSecondaryWindowOpen } = useModalContext()

  return (
    <TitleBarButton
      icon={ <SettingsIcon/> }
      onClick={ async () => {
        await openSecondaryWindow(WindowVariant.Settings, () => setIsSecondaryWindowOpen(true), () => setIsSecondaryWindowOpen(false), secondaryWindowEntry)
      } }
    />
  )
}

interface TitleBarProps {
  variant: 'main' | 'secondary'
  title?: string
  onClose?: () => void
}

const TitleBar = (props: TitleBarProps) => {
  const { isInitialized, fileName, unsavedChanges, isLocked } = useFileContentContext()
  let title = props.title
  if (isInitialized && title && props.variant === 'main') {
    document.title = `${ fileName } - ${ title }`
    title = `${ fileName }${ unsavedChanges ? '*' : '' } - ${ title }`
  }

  return (
    <div className={
      props.variant === 'main' ?
        'flex justify-between titlebar text-black dark:text-white items-center px-2 py-1 pr-36' :
        'flex justify-between titlebar text-black dark:text-white items-center px-2 py-1 pr-1'
    }>
      <div className="flex items-center">
        <TemporaryAppIcon/>
        {
          isInitialized ?
            <div>
              <SaveButton/>
              <ChangeMasterKeyButton/>
              {
                props.variant === 'main' && !isLocked ?
                  <LockButton/>
                  : null
              }
            </div>
            : null
        }
        <h1 className="truncate label-text text-sm pl-1.5">{ title }</h1>
      </div>
      {
        props.variant === 'main' ?
          <SettingsButton/>
          : <CloseButton onClick={ props.onClose }/>
      }
    </div>
  )
}

export default TitleBar