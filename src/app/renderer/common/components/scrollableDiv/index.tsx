import { ReactNode, useEffect, useRef, useState } from 'react'

interface IScrollableDivProps {
  children: ReactNode
  height?: 'max-h-full' | 'max-h-96' | 'max-h-80' | 'max-h-64' | 'max-h-52' | 'max-h-48' | 'max-h-32' | 'max-h-24' | 'max-h-16' | 'max-h-12'
  justifyContent?: 'justify-start' | 'justify-end' | 'justify-center' | 'justify-between' | 'justify-around' | 'justify-evenly'
  alignItems?: 'items-start' | 'items-end' | 'items-center' | 'items-baseline' | 'items-stretch'
}

const ScrollableDiv = ({ children, height, justifyContent, alignItems }: IScrollableDivProps) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [ isScrollable, setIsScrollable ] = useState(false)

  useEffect(() => {
    const div = divRef.current
    if (div) {
      const resizeObserver = new ResizeObserver(() => {
        setIsScrollable(div.scrollHeight > div.offsetHeight)
      })
      resizeObserver.observe(div)

      return () => {
        resizeObserver.unobserve(div)
      }
    }
  }, [ children ])

  return (
    <div className="bg-base-200 w-full flex-grow h-full rounded p-2">
      <div ref={ divRef }
           className={
             isScrollable ?
               `${ height } ${ justifyContent } ${ alignItems } scrollable pr-2` :
               `${ height } ${ justifyContent } ${ alignItems } scrollable`
           }
      >
        { children }
      </div>
    </div>
  )
}

export { ScrollableDiv }