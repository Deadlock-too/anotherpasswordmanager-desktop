import { createRoot } from 'react-dom/client'
import {useEffect, useState} from "react";

const lock = ('../../assets/lock.svg') as string

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
    window.darkMode.toggle()
    // window.send('toggle-theme', newMode)
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : ''}`}>
      <button onClick={toggleDarkMode}>Toggle dark mode</button>
    </div>
  )
}

const ListElement = (props: { icon: SVGElement, id: number, name: string, description: string }) => {
  return (<div
    key={props.id.valueOf()}
    className='dark:bg-slate-800 grid grid-cols-12 shadow w-full py-0.5 px-1.5 items-center rounded hover:bg-slate-900/10  transition duration-200 ease-in-out cursor-pointer'
    onClick={() => {
      console.log(props.id)
    }}
  >
    { props.icon }
    <h1 className='col-span-10 dark:text-white text-black'>{props.name}</h1>
  </div>)
}

const Index = () => {
  //define an array of elements
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
      <div className='dark:bg-slate-700 w-full px-2 py-2 shadow-xl rounded space-y-1.5'>
        {
          elements.map((element) => {
            return <ListElement icon={lock} id={element.id} name={element.name} description={element.description}/>
            // return (
            //   <div
            //     key={element.id.valueOf()}
            //     className='dark:bg-slate-800 grid grid-cols-12 shadow w-full py-0.5 px-1.5 items-center rounded hover:bg-slate-900/10  transition duration-200 ease-in-out cursor-pointer'
            //     onClick={() => {
            //       console.log(element.id)
            //     }}
            //   >
            //     <svg className='col-span-2' xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z"/></svg>
            //     <h1 className='col-span-10 dark:text-white text-black'>{element.name}</h1>
            //   </div>
            // )
          })
        }
      </div>
      <div className='dark:bg-slate-700 px-2 py-2 ring-1 ring-slate-900/5 shadow-xl rounded col-span-4'>
        <DarkModeToggleButton />
      </div>
    </div>
  </>
}

const root = createRoot(document.body)
root.render(<Index />)
