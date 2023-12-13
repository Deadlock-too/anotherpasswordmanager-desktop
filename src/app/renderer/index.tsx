import { createRoot } from 'react-dom/client'
import { ReactElement } from 'react'
import { FolderOpenIcon, LockIcon, PlusIcon, SunIcon, MoonIcon } from '../../assets/icons'

const DarkModeToggleButton = () => {
  const toggleDarkMode = () => {
    window.theming.darkMode.toggle()
  }

  return (
    <label className="swap swap-rotate pr-32 items-center">
      <input
        /* this hidden checkbox controls the state */
        type="checkbox"
        className="titlebar-icon"
        onClick={ toggleDarkMode }
      />
      <SunIcon className="swap-on fill-current titlebar-icon"/>
      <MoonIcon className="swap-off fill-current titlebar-icon"/>
    </label>
  )
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

const TitleBar = () => {
  return (
    <div className="flex justify-between titlebar text-black dark:text-white items-center px-4">
      <h1 className="truncate">Another password manager</h1>
      <DarkModeToggleButton/>
    </div>
  )
}

const Intro = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen md:flex-row">
      <div className="flex flex-col md:flex-row w-2/3 h-2/3">
        <div className="grid flex-grow card place-items-center">
          <div className="flex flex-col items-center justify-items-center gap-3 py-5">
            <button className="btn" onClick={ () => {
              window.dialog.fileManagement.open()
                .then((result) => {
                  console.log(`Renderer result: ${ result }`)
                })
            } }>
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
          <button className="btn" onClick={ () => {
            window.dialog.fileManagement.save()
              .then((result) => {
                console.log(`Renderer result: ${ result }`)
              })
          } }>
            <PlusIcon/>
            {/*{ l('Intro.Add New') }*/ }
            Aggiungi nuovo
          </button>
        </div>
      </div>
    </div>
  )
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

  return (<>
      <TitleBar/>
      <Intro/>
    </>
  )
}

const root = createRoot(document.body)
root.render(
  <Index/>
)
