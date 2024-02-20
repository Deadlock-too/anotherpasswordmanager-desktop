import { createContext, useEffect, useState } from 'react'
import { useConfigContext, useFileContentContext } from '../index'

interface ClipboardContextState {
  handleSetClipboard: (value: string) => void
}

export const ClipboardContext = createContext<ClipboardContextState>({} as ClipboardContextState)

export function ClipboardContextProvider({ children }) {
  const { config } = useConfigContext()
  const { isLocked } = useFileContentContext()
  const [ clipboardValue, setClipboardValue ] = useState<string>()
  const [ isClipboardSet, setIsClipboardSet ] = useState(false)

  const clearClipboard = () => {
    window.system.clipboard.read().then((value) => {
      clearTimeout(timer)
      timer = undefined

      if (clipboardValue !== value || !value) {
        return
      }

      window.system.clipboard.clear()
      setClipboardValue(undefined)
      setIsClipboardSet(false)
    })

  }

  let timer: NodeJS.Timeout | undefined = undefined

  const handleSetClipboard = (value: string) => {
    window.system.clipboard.write(value)
    setClipboardValue(value)
    setIsClipboardSet(true)
  }

  useEffect(() => {
    if (config.settings.security.autoClearClipboard && isClipboardSet) {
      if (timer) {
        clearTimeout(timer)
        timer = undefined
      }
      timer = setTimeout(() => {
        clearClipboard()
      }, config.settings.security.autoClearClipboardTime * 1000)
      return () => clearTimeout(timer)
    }
  }, [isClipboardSet, config.settings.security.autoClearClipboard, config.settings.security.autoClearClipboardTime])

  useEffect(() => {
    if (isClipboardSet && isLocked && config.settings.security.autoClearClipboardOnLock) {
      clearClipboard()
    }
  }, [isClipboardSet, isLocked, config.settings.security.autoClearClipboardOnLock])

  const context: ClipboardContextState = {
    handleSetClipboard
  }

  return (
    <ClipboardContext.Provider value={ context }>
      { children }
    </ClipboardContext.Provider>
  )
}