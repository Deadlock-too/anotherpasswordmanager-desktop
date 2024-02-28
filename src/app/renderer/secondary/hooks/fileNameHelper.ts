import EventIdentifiers from '../../../../consts/eventIdentifiers'
import { useEffect, useState } from 'react'

export const useFileNameHelper = () => {
  const [ fileName, setFileName ] = useState<string>('')
  const [ openingFileName, setOpeningFileName ] = useState<string>('')

  useEffect(() => {
    window.electron.events.propagate(EventIdentifiers.GetFileName)
    window.electron.events.propagate(EventIdentifiers.GetOpeningFileName)

    const getFileNameHandler = (fileName: string) => {
      setFileName(fileName)
    }
    window.electron.events.subscribeToResult(EventIdentifiers.GetFileName, getFileNameHandler)

    const getOpeningFileNameHandler = (fileName: string) => {
      setOpeningFileName(fileName)
    }
    window.electron.events.subscribeToResult(EventIdentifiers.GetOpeningFileName, getOpeningFileNameHandler)

    return () => {
      window.electron.events.unsubscribeFromResult(EventIdentifiers.GetFileName)
      window.electron.events.unsubscribeFromResult(EventIdentifiers.GetOpeningFileName)
    }
  })

  return {
    fileName,
    openingFileName
  }
}