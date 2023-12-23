import { Entry, Folder, UUID } from '../../types'
import { ReactNode } from 'react'
import { PlusIcon } from '../../../../assets/icons'

interface ColumnProps {
  label: string | undefined
  width: 'w-3/12' | 'w-6/12'
  unselectableContent?: boolean
  variant?: 'folders' | 'entries' | 'detail',
  elements?: (Folder | Entry)[],
  children?: ReactNode,
  onSubmit?: (entry: Entry) => void,
  onSelectFolder?: (id: UUID) => void,
  onSelectEntry?: (id: UUID) => void,
  onAddEntry?: () => void,
  entry?: Entry
}

const Column = ({
  label = undefined,
  width = 'w-3/12',
  unselectableContent = true,
  variant = undefined,
  elements = [],
  children = null,
  onSubmit = undefined,
  onSelectFolder = undefined,
  onSelectEntry = undefined,
  onAddEntry = undefined,
  entry = undefined
}: ColumnProps) => {
  let margin: string | undefined = undefined
  if (variant === 'folders') {
    margin = 'mr-1'
  } else if (variant === 'entries') {
    margin = 'mr-1 ml-1'
  } else if (variant === 'detail') {
    margin = 'ml-1'
  }
  return (
    <div className={`${width} ${margin} h-full flex flex-col ${unselectableContent ? 'unselectable' : ''}`}>
      <div className='flex flex-row justify-between items-center'>
        <label className={`pl-1.5 font-bold ${unselectableContent ? '' : 'unselectable'}`}>
          {label}
        </label>
        {
          ((variant === 'folders' || variant === 'entries') &&
            <button
              className='btn btn-xs btn-circle'
              onClick={onAddEntry}
            >
              <PlusIcon/>
            </button>
          )
        }
      </div>
      <div className='divider m-0'/>
      <div className='bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper'>
        <div className='scrollbar'>
          {
            variant === 'detail' ?
              children :
              elements?.length === 0 ?
                <div className='h-full justify-center flex flex-col'>
                  <h1 className='text-center font-bold'>
                    No {variant} found
                  </h1>
                  <h2 className='text-center font-thin pr-5 pl-5'>Tap on the plus icon to add a new {variant}</h2>
                </div>
                :
                <ul className='menu menu-xs bg-base-300 w-full flex-grow rounded-box'>
                  {
                    elements.map((child) => {
                      return (
                        <li id={child.Id}>
                          <a onClick={() => {
                            variant === 'folders' ?
                              onSelectFolder!(child.Id) :
                              onSelectEntry!(child.Id)
                          }}>
                            {
                              variant === 'folders' ?
                                (child as Folder).Name :
                                (child as Entry).Title
                            }
                          </a>
                        </li>
                      )
                    })}
                </ul>
          }
        </div>
      </div>
    </div>
  )
}

export default Column