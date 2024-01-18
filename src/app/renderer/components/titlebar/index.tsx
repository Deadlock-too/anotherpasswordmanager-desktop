import { SaveIcon, SettingsIcon, TemporaryAppIcon, UpdateIcon } from '../../../../assets/icons'
import { encrypt } from '../../../main/utils/crypt'
import { useFileContentContext, useModalContext } from '../../contexts'
import { ReactNode } from 'react'

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
  const { setIsPasswordModalOpen } = useModalContext()
  return (
    <TitleBarButton
      icon={ <UpdateIcon/> }
      onClick={ () => {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        document.getElementById('updatePasswordModal').showModal()
        setIsPasswordModalOpen(true)
      } }
    />
  )
}

const SettingsButton = () => {
  const { setIsSettingsModalOpen } = useModalContext()
  return (
    <TitleBarButton
      icon={ <SettingsIcon/> }
      onClick={ () => {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        document.getElementById('settingsModal').showModal()
        setIsSettingsModalOpen(true)
      } }
    />
  )
}

const TitleBar = () => {
  const { isInitialized } = useFileContentContext()

  return (
    <div className="flex justify-between titlebar text-black dark:text-white items-center px-2 pr-36 py-1">
      <div className="flex items-center">
        <TemporaryAppIcon/>
        { isInitialized ?
          <div>
            <SaveButton/>
            <ChangeMasterKeyButton/>
          </div>
          : null }
      </div>
      {/*<h1 className="truncate">Another password manager</h1>*/ }
      {/* TODO MANAGE TITLE-BAR */ }
      <h1 className="truncate"></h1>
      {/*<DarkModeToggle/>*/ }
      <SettingsButton/>
    </div>
  )
}

export default TitleBar