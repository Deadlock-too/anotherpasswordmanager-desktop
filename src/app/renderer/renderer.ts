import './index'
import './styles.css'

declare global {
  interface Window {
    theming: {
      darkMode: {
        toggle: () => void
        system: () => void
      }
    },
    dialog: {
      openFile: {
        open: () => Promise<string>
      }
    }
  }
}