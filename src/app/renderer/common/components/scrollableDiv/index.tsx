import { useEffect, useRef, useState } from 'react'

const ScrollableDiv = ({ children }) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [ isScrollable, setIsScrollable ] = useState(false)

  useEffect(() => {
    if (divRef.current) {
      setIsScrollable(divRef.current.scrollHeight > divRef.current.clientHeight)
    }
  }, [ children ])

  return (
    <div className="bg-base-200 w-full flex-grow h-fit rounded p-2">
      <div ref={ divRef } className={ isScrollable ? 'max-h-72 scrollable' : 'max-h-72' }>
        { children }
      </div>
    </div>
  )
}

export { ScrollableDiv }