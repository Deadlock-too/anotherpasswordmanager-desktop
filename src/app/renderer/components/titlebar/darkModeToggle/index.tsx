import { MoonIcon, SunIcon } from '../../../../../assets/icons'
import { Component } from 'react'

export default class DarkModeToggle extends Component {
  render() {
    const toggleDarkMode = () => {
      window.theming.darkMode.toggle()
    }

    return (
      <label className="swap swap-rotate pr-32 items-center">
        <input
          /* this hidden checkbox controls the state */
          type="checkbox"
          className="titlebar-icon"
          onClick={toggleDarkMode}
        />
        <SunIcon className="swap-on fill-current titlebar-icon"/>
        <MoonIcon className="swap-off fill-current titlebar-icon"/>
      </label>
    )
  }
}