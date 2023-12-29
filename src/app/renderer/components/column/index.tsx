import { Entry, Folder, UUID } from '../../types'
import { ReactNode, useContext } from 'react'
import { PlusIcon } from '../../../../assets/icons'
import { FileContentContext } from '../../contexts'

interface ColumnProps {
  label: string | undefined
  width: 'w-3/12' | 'w-6/12'
  unselectableContent?: boolean
  variant?: 'folders' | 'entries' | 'detail',
  elements?: (Folder | Entry)[],
  children?: ReactNode,
  onSubmit?: (entry: Entry) => void,
  onSelectFolder?: (folder: Folder, currentlySelectedEntryId: UUID | null, currentlySelectedFolderId: UUID | null) => void,
  onSelectEntry?: (entry: Entry) => void,
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
  onSelectFolder = undefined,
  onSelectEntry = undefined,
  onAddEntry = undefined
}: ColumnProps) => {
  let margin: string | undefined = undefined
  if (variant === 'folders') {
    margin = 'mr-1'
  } else if (variant === 'entries') {
    margin = 'mr-1 ml-1'
  } else if (variant === 'detail') {
    margin = 'ml-1'
  }

  const { selectedFolderId, selectedEntryId } = useContext(FileContentContext)

  return (
    <div className={ `${ width } ${ margin } h-full flex flex-col ${ unselectableContent ? 'unselectable' : '' }` }>
      <div className='flex flex-row justify-between items-center'>
        <label className={ `pl-1.5 font-bold ${ unselectableContent ? '' : 'unselectable' }` }>
          { label }
        </label>
        {
          ((variant === 'folders' || variant === 'entries') &&
            <button
              className='btn btn-xs btn-circle'
              onClick={ onAddEntry }
              disabled={ variant === 'entries' && selectedFolderId === null }
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
                    No { variant } found
                  </h1>
                  <h2 className='text-center font-thin pr-5 pl-5'>Tap on the plus icon to add a new { variant }</h2>
                </div>
                :
                <ul className='menu menu-md bg-base-300 w-full flex-grow rounded-box'>
                  {
                    elements.map((child) => {
                      return (
                        <li key={ child.Id } className={ (
                          (variant === 'folders' && child.Id === selectedFolderId) ||
                          (variant === 'entries' && child.Id === selectedEntryId)
                        ) ? 'selected ' : ''
                        }>
                          <a onClick={ () => {
                            variant === 'folders' ?
                              onSelectFolder!(child as Folder, selectedEntryId, selectedFolderId) :
                              onSelectEntry!(child as Entry)
                          } }>
                            {
                              variant === 'folders' ?
                                (child as Folder).Name :
                                (child as Entry).Title
                            }
                          </a>
                        </li>
                      )
                    }) }
                </ul>
          }
        </div>
      </div>
    </div>
  )
}

export default Column