import { Entry, Folder, UUID } from '../../types'
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { PlusIcon, TrashIcon } from '../../../../assets/icons'
import { FileContentContext } from '../../contexts'
import i18n from '../../../../i18n'

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

// TODO MAKE SPECIFIC COLUMN IMPLEMENTATION FOR FOLDERS AND ENTRIES
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

  const {
    selectedFolderId,
    hoveringFolderId,
    setHoveringFolderId,
    setDeletingFolder,
    selectedEntryId,
    hoveringEntryId,
    setHoveringEntryId,
    setDeletingEntry,
  } = useContext(FileContentContext)

  const [ disableElementSelection, setDisableElementSelection ] = useState(false)

  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const liRefs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    textRefs.current = textRefs.current.slice(0, elements.length)
    liRefs.current = liRefs.current.slice(0, elements.length)

    elements.forEach((_, i) => {
      if (!textRefs.current[i]) {
        textRefs.current[i] = null
      }
      if (!liRefs.current[i]) {
        liRefs.current[i] = null
      }
    })

    elements.forEach((_, i) => {
      const textElement = textRefs.current[i]
      const liElement = liRefs.current[i]
      if (textElement && liElement) {
        liElement.addEventListener('mouseenter', () => {
          const scrollAmount = (textElement.scrollWidth - textElement.offsetWidth) + 24
          if (scrollAmount <= 0) return
          const scrollTime = scrollAmount / 7.5
          textElement.style.setProperty('--scroll-amount', `-${ scrollAmount }px`)
          textElement.style.setProperty('--scroll-time', `${ scrollTime }s`)
          textElement.classList.add('truncate-scroll')
        })

        liElement.addEventListener('mouseleave', () => textElement.classList.remove('truncate-scroll'))
      }
    })
  })


  return (
    <div className={ `${ width } ${ margin } h-full flex flex-col ${ unselectableContent ? 'unselectable' : '' }` }>
      <div className="flex flex-row justify-between items-center">
        <label className={ `pl-1.5 font-bold ${ unselectableContent ? '' : 'unselectable' }` }>
          { label }
        </label>
        {
          ((variant === 'folders' || variant === 'entries') &&
            <button
              className="btn btn-xs btn-circle"
              onClick={ onAddEntry }
              disabled={ variant === 'entries' && selectedFolderId === null }
            >
              <PlusIcon/>
            </button>
          )
        }
      </div>
      <div className="divider m-0"/>
      <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
        <div className="scrollbar">
          {
            variant === 'detail' ?
              children :
              elements?.length === 0 ?
                <div className="h-full justify-center flex flex-col">
                  <h1 className="text-center font-bold">
                    { i18n.t(`Main.No ${ variant }`) }
                  </h1>
                  <h2 className="text-center font-thin pr-5 pl-5">
                    { i18n.t(`Main.Add ${ variant }`) }
                  </h2>
                </div>
                :
                <ul className="menu menu-md bg-base-300 w-full flex-grow rounded-box gap-1">
                  {
                    elements.map((child, i) => {
                      const isHovered = (variant === 'folders' && child.Id === hoveringFolderId) || (variant === 'entries' && child.Id === hoveringEntryId)
                      const isSelected = (variant === 'folders' && child.Id === selectedFolderId) || (variant === 'entries' && child.Id === selectedEntryId)

                      return (
                        <li
                          key={ child.Id }
                          className={ isSelected ? 'selected' : '' }
                          onMouseEnter={ () => {
                            if (variant === 'folders') {
                              setHoveringFolderId(child.Id)
                            } else if (variant === 'entries') {
                              setHoveringEntryId(child.Id)
                            }
                          } }
                          onMouseLeave={ () => {
                            if (variant === 'folders') {
                              setHoveringFolderId(null)
                            } else if (variant === 'entries') {
                              setHoveringEntryId(null)
                            }
                          } }
                          ref={ el => liRefs.current[i] = el }
                        >
                          <a key={ child.Id } onClick={ () => {
                            if (disableElementSelection) return

                            variant === 'folders' ?
                              onSelectFolder!(child as Folder, selectedEntryId, selectedFolderId) :
                              onSelectEntry!(child as Entry)
                          } }
                             className="justify-between items-center"
                          >
                            <div className="flex-grow truncate" ref={ el => textRefs.current[i] = el }>
                              {
                                variant === 'folders' ?
                                  (child as Folder).Name :
                                  (child as Entry).Title

                                // TODO: Fix this
                                // Check if any of the children has the same name as the current child
                                // If so, append the folder id to the name
                                // This is to prevent duplicate names in the UI
                                // variant === 'folders' ?
                                //   elements.filter((element) => element.Name === child.Name).length > 1 ?
                                //     `${ child.Name } (${ child.Username })` :
                                //     child.Name :
                                //   child.Name
                              }
                            </div>
                            <button
                              className={ isHovered ?
                                'btn btn-xs btn-square btn-error justify-center items-center -mr-2 -mt-1 -mb-1' :
                                'hidden'
                              }
                              onClick={ () => {
                                if (variant === 'folders') {
                                  setDeletingFolder(child as Folder)
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  document.getElementById('folderDeletionModal').showModal()
                                } else {
                                  setDeletingEntry(child as Entry)
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  document.getElementById('entryDeletionModal').showModal()
                                }
                              } }
                              onMouseEnter={ () => setDisableElementSelection(true) }
                              onMouseLeave={ () => setDisableElementSelection(false) }
                            >
                              <TrashIcon/>
                            </button>
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