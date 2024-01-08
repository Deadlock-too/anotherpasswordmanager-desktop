import { useContext } from 'react'
import DarkModeToggle from './darkModeToggle'
import { SaveIcon } from '../../../../assets/icons'
import { FileContentContext } from '../../contexts'

const SaveButton = () => {
  const { filePath, setFilePath, fileContent } = useContext(FileContentContext)

  const saveFile = () => {

    const saveFile = (path: string, content: string) => {
      window.electron.saveFile(path, content)
    }

    if (filePath) {
      saveFile(filePath, JSON.stringify(fileContent))
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
            saveFile(filePath, JSON.stringify(fileContent))
        })
    }
  }

  return (
    <label className="swap swap-rotate pr-32 items-center">
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

const TitleBar = () => {
  const {isInitialized} = useContext(FileContentContext)

  return (
    <div className="flex justify-between titlebar text-black dark:text-white items-center px-3 py-1">
      {/*<SaveIcon className="titlebar-icon"/>*/ }
      { isInitialized ? <SaveButton/> : null }
      {/*<h1 className="truncate">Another password manager</h1>*/ }
      {/* TODO MANAGE TITLE-BAR */ }
      <h1 className="truncate"></h1>
      <DarkModeToggle/>
    </div>
  )
}

export default TitleBar