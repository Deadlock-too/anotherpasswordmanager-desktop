import { createRoot } from 'react-dom/client'
import { ReactElement } from 'react'
import { FolderOpenIcon, LockIcon, PlusIcon } from '../../assets/icons'

const DarkModeToggleButton = () => {

  const toggleDarkMode = () => {
    window.theming.darkMode.toggle()
  }

  // return (
  //   <div>
  //     <button onClick={ toggleDarkMode } className='btn'>Toggle dark mode</button>
  //   </div>
  // )

  return (<label className="swap swap-rotate">
    {/* this hidden checkbox controls the state */ }
    <input type="checkbox" onClick={ toggleDarkMode }/>
    {/* sun icon */ }
    <svg className="swap-on fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
    </svg>
    {/* moon icon */ }
    <svg className="swap-off fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
    </svg>
  </label>)
}

const Element = (props: { children: ReactElement, id: number, name: string, description: string }) => {
  return (<div
    key={ props.id.valueOf() }
    className="dark:bg-slate-800 grid grid-cols-12 shadow w-full py-0.5 px-1.5 items-center rounded hover:bg-slate-900/10  transition duration-200 ease-in-out cursor-pointer"
    onClick={ () => {
      console.log(props.id)
    } }
  >
    {
      !!props.children &&
      <div className="col-span-2">
        { props.children }
      </div>
    }
    <h1 className="col-span-10 dark:text-white text-black unselectable">{ props.name }</h1>
  </div>)
}

const List = (props: { elements: { id: number, name: string, description: string }[] }) => {
  return <div className="dark:bg-slate-700 w-full px-2 py-2 shadow-xl rounded space-y-1.5">
    { props.elements.map((element) => {
      return (
        <Element id={ element.id } name={ element.name } description={ element.description }>
          <LockIcon/>
        </Element>
      )
    }) }
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

  return (
    <div className="flex flex-col justify-center items-center h-screen md:flex-row">
      <div className="flex flex-col md:flex-row w-2/3 h-2/3">
        <div className="grid flex-grow card place-items-center">
          <div className="flex flex-col items-center justify-items-center gap-3 py-5">
            <button className="btn" onClick={() => window.dialog.openFile.open()}>
              <FolderOpenIcon/>
              {/*{ l('Intro.Open Existing') }*/ }
              Apri esistente
            </button>
          </div>
        </div>
        <div className="divider md:divider-horizontal unselectable">
          {/*{ l('Intro.Or') }*/ }
          oppure
        </div>
        <div className="grid flex-grow card place-items-center">
          <button className="btn">
            <PlusIcon/>
            {/*{ l('Intro.Add New') }*/ }
            Aggiungi nuovo
          </button>
          <DarkModeToggleButton/>
        </div>
      </div>
    </div>
  )
}

const root = createRoot(document.body)
root.render(<Index/>)
