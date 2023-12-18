import { Component } from 'react'
import DarkModeToggle from './darkModeToggle'

export default class TitleBar extends Component {
  render() {
    return (
      <div className="flex justify-between titlebar text-black dark:text-white items-center px-3 py-1 ">
        <h1 className="truncate">Another password manager</h1>
        <DarkModeToggle/>
      </div>
    )
  }
}