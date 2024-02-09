import { CloseIcon, SaveIcon, SettingsIcon, TemporaryAppIcon, UpdateIcon } from '../../../../../assets/icons'
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
  const { filePath, setFilePath, fileContent, password } = useFileContentContext()
  const saveFile = () => {
    const saveFile = (path: string, content: string) => {
      window.electron.saveFile(path, content)
    }

    let content = JSON.stringify(fileContent)
    if (password) {
      content = encrypt(content, password)
    }

    if (filePath) {
      saveFile(filePath, content)
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
  const { secondaryWindowEntry } = useModalContext()
  return (
    <TitleBarButton
      icon={ <UpdateIcon/> }
      onClick={ async () => {
        await openSecondaryWindow(WindowVariant.PasswordUpdate, secondaryWindowEntry)
      } }
    />
  )
}

const CloseButton = ({onClick}) => {
  return (
    <TitleBarButton
      icon={ <CloseIcon/> }
      onClick={ onClick }
    />
  )
}

const SettingsButton = () => {
  const { secondaryWindowEntry } = useModalContext()

  return (
    <TitleBarButton
      icon={ <SettingsIcon/> }
      onClick={ async () => {
        await openSecondaryWindow(WindowVariant.Settings, secondaryWindowEntry)
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
  const { isInitialized } = useFileContentContext()

  return (
    <div className={
      props.variant === 'main' ?
      'flex justify-between titlebar text-black dark:text-white items-center px-2 py-1 pr-36' :
      'flex justify-between titlebar text-black dark:text-white items-center px-2 py-1 pr-1'
    }>
      <div className="flex items-center">
        <TemporaryAppIcon/>
        { isInitialized ?
          <div>
            <SaveButton/>
            <ChangeMasterKeyButton/>
          </div>
          : null }
      </div>
      <h1 className="truncate label-text text-sm">{props.title}</h1>
      {
        props.variant === 'main' ?
          <SettingsButton/>
          : <CloseButton onClick={ props.onClose }/>
      }
    </div>
  )
}

export default TitleBar