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
      fileManagement: {
        open: () => Promise<string | undefined>,
        save: () => Promise<string | undefined>
      }
    }
  }
}