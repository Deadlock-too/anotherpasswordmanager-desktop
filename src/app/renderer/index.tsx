import { createRoot } from 'react-dom/client'
import { ReactElement, useEffect, useState } from 'react'
import { ReactComponent as LockIcon } from '../../assets/icons/svg/lock.svg'

const DarkModeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme === 'dark') {
      setIsDarkMode(true)
    } else {
      setIsDarkMode(false)
    }
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    window['darkMode'].toggle()
    // window.send('toggle-theme', newMode)
  }

  return (
    <div>
      <button onClick={toggleDarkMode}>Toggle dark mode</button>
    </div>
  )
}

const Element = (props: { children: ReactElement, id: number, name: string, description: string }) => {
  return (<div
    key={props.id.valueOf()}
    className='dark:bg-slate-800 grid grid-cols-12 shadow w-full py-0.5 px-1.5 items-center rounded hover:bg-slate-900/10  transition duration-200 ease-in-out cursor-pointer'
    onClick={() => {
      console.log(props.id)
    }}
  >
    {
      !!props.children &&
      <div className='col-span-2'>
        { props.children }
      </div>
    }
    <h1 className='col-span-10 dark:text-white text-black unselectable'>{props.name}</h1>
  </div>)
}

const List = (props: { elements: { id: number, name: string, description: string }[] }) => {
  return <div className='dark:bg-slate-700 w-full px-2 py-2 shadow-xl rounded space-y-1.5'>
  {props.elements.map((element) => {
    return (
      <Element id={element.id} name={element.name} description={element.description}>
        <LockIcon />
      </Element>
    )
  })}
  </div>
}

const Index = () => {

  //define an array of mockup elements to display
  const elements = [
    {
      id: 1,
      name: 'Password 1',
      description: 'Description 1'
    },
    {
      id: 2,
      name: 'Password 2',
      description: 'Description 2'
    },
    {
      id: 3,
      name: 'Password 3',
      description: 'Description 3'
    },
    {
      id: 4,
      name: 'Password 4',
      description: 'Description 4'
    },
    {
      id: 5,
      name: 'Password 5',
      description: 'Description 5'
    },
    {
      id: 6,
      name: 'Password 6',
      description: 'Description 6'
    }
  ]

  return <>
    <div className='h-screen grid grid-cols-5 gap-2 columns-2 bg-white dark:bg-slate-800 px-1.5 py-1.5 ring-1 ring-slate-900/5'>
      {<List elements={elements} />}
      <div className='dark:bg-slate-700 px-2 py-2 ring-1 ring-slate-900/5 shadow-xl rounded col-span-4'>
        <DarkModeToggleButton />
      </div>
    </div>
  </>
}

const root = createRoot(document.body)
root.render(<Index />)
