import { MoonIcon, SunIcon } from '../../../../../assets/icons'
import { useContext } from 'react'
import { ThemeContext } from '../../../contexts'


const DarkModeToggle = () => {
  const { toggleDarkMode } = useContext(ThemeContext)

  const toggle = () => {
    window.theming.darkMode.toggle()
    toggleDarkMode()
  }

  return (
    <label className="swap swap-rotate pr-32 items-center">
      <input
        /* this hidden checkbox controls the state */
        type="checkbox"
        className="titlebar-icon"
        onClick={ toggle }
      />
      <SunIcon className="swap-on fill-current titlebar-icon"/>
      <MoonIcon className="swap-off fill-current titlebar-icon"/>
    </label>
  )
}

export default DarkModeToggle
