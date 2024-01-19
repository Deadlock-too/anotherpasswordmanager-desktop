import { useModalContext } from '../../../contexts'
import { useState } from 'react'

// const GeneralSettings = () => {
//
// }

const SettingsModal = () => {
  // const { isSettingsModalOpen, setIsSettingsModalOpen } = useModalContext()
  const [ selectedSetting, setSelectedSetting ] = useState<string>('General')

  const settings = [
    'General',
    'Appearance',
    'Security'
  ]


  return (
    <div className="flex flex-row h-full w-full">
      <div className="w-3/12 h-full flex flex-col unselectable">
        <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
          <div className="scrollbar">
            <ul className="menu menu-md h-full bg-base-300 w-full flex-grow rounded-box gap-0.5">
              {
                settings.map((setting) => {
                  const isSelected = selectedSetting === setting
                  return (
                    <li key={ setting } className={ isSelected ? 'selected' : '' }>
                      <a key={ setting } onClick={ () => setSelectedSetting(setting) }
                         className="justify-between items-center">
                        { setting }
                      </a>
                    </li>
                  )
                })
              }
            </ul>
          </div>
        </div>
      </div>
      <div className="w-9/12 h-full flex flex-col unselectable">
        <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
          <div className="scrollbar">
            <div className="h-full justify-center flex flex-col">
              <h1 className="text-center font-bold">
                Details for { selectedSetting }
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal