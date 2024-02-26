import EventIdentifiers from '../../../../consts/eventIdentifiers'
import { useEffect, useState } from 'react'

export const useFileNameHelper = () => {
  const [ fileName, setFileName ] = useState<string>('')

  useEffect(() => {
    window.electron.events.propagate(EventIdentifiers.GetFileName)

    const getFileNameHandler = (fileName: string) => {
      setFileName(fileName)
    }
    window.electron.events.subscribeToResult(EventIdentifiers.GetFileName, getFileNameHandler)

    return () => {
      window.electron.events.unsubscribeFromResult(EventIdentifiers.GetFileName)
    }
  })

  return {
    fileName
  }
}