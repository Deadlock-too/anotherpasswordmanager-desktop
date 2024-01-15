import { useContext } from 'react'
import DarkModeToggle from './darkModeToggle'
import { SaveIcon, UpdateIcon } from '../../../../assets/icons'
import { FileContentContext, ModalContext } from '../../contexts'
import password from '../modal/password'
import { encrypt } from '../../../main/utils/crypt'

const SaveButton = () => {
  const { filePath, setFilePath, fileContent, password } = useContext(FileContentContext)

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
    <label className="swap swap-rotate items-center">
      <input
        /* this hidden checkbox controls the state */
        type="checkbox"
        className="titlebar-icon"
        onClick={ saveFile }
      />
      <SaveIcon/>
    </label>
  )
}

const ChangeMasterKeyButton = () => {
  const { setIsPasswordModalOpen } = useContext(ModalContext)

  return (
    <label className="swap swap-rotate pl-2 items-center">
      <input
        /* this hidden checkbox controls the state */
        type="checkbox"
        className="titlebar-icon"
        onClick={ () => {
          /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
          // @ts-ignore
          document.getElementById('updatePasswordModal').showModal()
          setIsPasswordModalOpen(true)
        } }
      />
      <UpdateIcon/>
    </label>
  )
}

const TitleBar = () => {
  const {isInitialized} = useContext(FileContentContext)

  return (
    <div className="flex justify-between titlebar text-black dark:text-white items-center px-3 py-1">
      {/*<SaveIcon className="titlebar-icon"/>*/ }
      { isInitialized ?
        <div>
          <SaveButton/>
          <ChangeMasterKeyButton />
        </div>
        : null }
      {/*<h1 className="truncate">Another password manager</h1>*/ }
      {/* TODO MANAGE TITLE-BAR */ }
      <h1 className="truncate"></h1>
      <DarkModeToggle/>
    </div>
  )
}

export default TitleBar