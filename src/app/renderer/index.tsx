import { createRoot } from 'react-dom/client'
// import { ReactElement } from 'react'
// import { LockIcon } from '../../assets/icons'
import Intro from './components/intro'
import TitleBar from './components/titlebar'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { useEffect, useState } from 'react'


/*
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
*/

// let initialI18nStore = ipcRenderer.sendSync('get-initial-translations')
//
// ipcRenderer.on('language-changed', (event, arg) => {
//   if (!i18n.hasResourceBundle(arg.language, arg.namespace)) {
//     i18n.addResourceBundle(arg.language, arg.namespace, arg.resource)
//   }
//   i18n.changeLanguage(arg.language)
// })

// let initialI18nStore = window.localization.getInitialI18nStore()

// const Index = () => {
//   return (<>
//       <TitleBar/>
//       <Intro/>
//     </>
//   )
// }
//
// const root = createRoot(document.body)
// root.render(
//   // <I18nextProvider i18n={i18n} initialI18nStore={initialI18nStore} initialLanugage='en'>
//     <Index/>
//   // </I18nextProvider>
// )

// const initialI18nStore = window.localization.getInitialI18nStore()

const App = () => {
  const [initialI18nStore, setInitialI18nStore] = useState(null)

  useEffect(() => {
    window.localization.getInitialI18nStore().then(setInitialI18nStore)
  }, [])

  if (!initialI18nStore) return null

  return (
    <I18nextProvider i18n={i18n}>
      <TitleBar/>
      <div>
        <Intro/>
      </div>
    </I18nextProvider>
  )
}

const root = createRoot(document.body)
root.render(
  <App/>
)
