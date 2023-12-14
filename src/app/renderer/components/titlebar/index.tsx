import { Component } from 'react'
import DarkModeToggleButton from './themeToggleButton'

export default class TitleBar extends Component {
  render() {
    return (
      <div className="flex justify-between titlebar text-black dark:text-white items-center px-4">
        <h1 className="truncate">Another password manager</h1>
        <DarkModeToggleButton/>
      </div>
    )
  }
}