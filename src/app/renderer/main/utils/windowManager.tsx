import { createRoot } from 'react-dom/client'
import TitleBar from '../components/titlebar'

const Dialog = () => {
  return (
    <div>
      <h1>Any other dialog</h1>
    </div>
  )
}

export const openSecondaryWindow = async () => {
  window.electron.getSecondaryWindowEntry()
    .then((entry) => {
      console.log(entry)

      // const win = window.open('../secondary_window', 'secondary')
      const win = window.open(entry, 'secondary')
    })

  /*
  if (win) {
    win.document.write(`
      <!DOCTYPE html>
      <html lang="">
        <head>
          <title>No-title</title>
<!--          <script>-->
<!--            (function(){-->
<!--             -->
<!--            })()-->
<!--          </script>-->
        </head>
        <body>
          <div id="root"/>
        </body>
      </html>
    `)
    win.document.title = 'Secondary Window'

    const rootDiv = win.document.getElementById('root')
    if (!rootDiv)
      throw new Error('Root div not found')

    const root = createRoot(rootDiv)
    root.render(
      <div>
        <TitleBar/>
        <Settings/>
      </div>
    )
  }
  */
}