import { Entry, Folder, UUID } from '../../types'
import { ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { CheckIcon, CrossIcon, PencilIcon, PlusIcon, TrashIcon } from '../../../../assets/icons'
import { FileContentContext } from '../../contexts'
import i18n from '../../../../i18n'
import { Formik } from 'formik'

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
    editingFolderId,
    setEditingFolderId,
    handleUpdateFolder,
    selectedEntryId,
    hoveringEntryId,
    setHoveringEntryId,
    setDeletingEntry,
    editingEntryId,
    setEditingEntryId,
    handleUpdateEntry
  } = useContext(FileContentContext)

  const [ disableElementSelection, setDisableElementSelection ] = useState(false)

  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const liRefs = useRef<(HTMLLIElement | null)[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

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
          let scrollAmount = (textElement.scrollWidth - textElement.offsetWidth)
          if (scrollAmount <= 0) return
          scrollAmount += 24
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
                      const isEditing = (variant === 'folders' && child.Id === editingFolderId) || (variant === 'entries' && child.Id === editingEntryId)

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
                          <Formik
                            initialValues={ { title: variant === 'folders' ? (child as Folder).Name : (child as Entry).Title } }
                            validate={
                              values => {
                                const errors: any = {}
                                if (!values.title) {
                                  errors.title = i18n.t('Common.Validations.Required field')
                                }
                                return errors
                              }
                            }
                            onSubmit={ (values, { setSubmitting }) => {
                              setTimeout(() => {
                                if (variant === 'folders') {
                                  const folderChild = child as Folder
                                  folderChild.Name = values.title
                                  handleUpdateFolder(folderChild)
                                } else {
                                  const entryChild = child as Entry
                                  entryChild.Title = values.title
                                  handleUpdateEntry(entryChild)
                                }
                                setSubmitting(false)
                              }, 400)
                            } }
                          >
                            { ({
                              values,
                              errors,
                              touched,
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              isSubmitting,
                              handleReset,
                            }) => (
                              <a key={ child.Id } onClick={ () => {
                                if (disableElementSelection || editingFolderId || editingEntryId) return

                                variant === 'folders' ?
                                  onSelectFolder!(child as Folder, selectedEntryId, selectedFolderId) :
                                  onSelectEntry!(child as Entry)
                              } }
                                 className="justify-between items-center"
                              >
                                <div className="flex-grow truncate" ref={ el => textRefs.current[i] = el }>
                                  {
                                    (child.Id == editingFolderId || child.Id == editingEntryId) ?
                                      <input
                                        type="text"
                                        name="title"
                                        onChange={ handleChange }
                                        onBlur={ handleBlur }
                                        value={ values.title }
                                        className={ errors.title ?
                                          'input input-sm input-error w-full' :
                                          'input input-sm input-ghost w-full'
                                        }
                                        disabled={ isSubmitting }
                                        ref={ inputRef }
                                        onKeyUp={ (e) => {
                                          if (e.key === 'Escape') {
                                            handleReset()
                                            setEditingFolderId(null)
                                          }
                                        } }
                                      />
                                      :
                                      (variant === 'folders' ?
                                        (child as Folder).Name :
                                        (child as Entry).Title)

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
                                {
                                  isEditing ?
                                    (
                                      <div className="flex gap-1 -mr-2.5 -mt-1 -mb-1">
                                        <button
                                          className="btn btn-xs btn-square btn-neutral justify-center items-center"
                                          onClick={ () => {
                                            handleSubmit()
                                            if (variant === 'folders') {
                                              setEditingFolderId(null)
                                            } else {
                                              setEditingEntryId(null)
                                            }
                                          } }
                                          onMouseEnter={ () => setDisableElementSelection(true) }
                                          onMouseLeave={ () => setDisableElementSelection(false) }
                                        >
                                          <CheckIcon/>
                                        </button>
                                        <button
                                          className="btn btn-xs btn-square btn-neutral justify-center items-center"
                                          onClick={ () => {
                                            if (variant === 'folders') {
                                              setEditingFolderId(null)
                                            } else {
                                              setEditingEntryId(null)
                                            }
                                            handleReset()
                                          } }
                                          onMouseEnter={ () => setDisableElementSelection(true) }
                                          onMouseLeave={ () => setDisableElementSelection(false) }
                                        >
                                          <CrossIcon/>
                                        </button>
                                      </div>
                                    )
                                    :
                                    (
                                      <div className="flex gap-1 -mr-2.5 -mt-1 -mb-1">
                                        <button
                                          className={ isHovered ?
                                            'btn btn-xs btn-square btn-neutral justify-center items-center' :
                                            'hidden'
                                          }
                                          onClick={ () => {
                                            if (variant === 'folders') {
                                              setEditingFolderId(child.Id)
                                            } else {
                                              setEditingEntryId(child.Id)
                                            }
                                            setTimeout(() => {
                                              inputRef.current?.focus()
                                            }, 100)
                                          } }
                                          onMouseEnter={ () => setDisableElementSelection(true) }
                                          onMouseLeave={ () => setDisableElementSelection(false) }
                                        >
                                          <PencilIcon/>
                                        </button>
                                        <button
                                          className={ isHovered ?
                                            'btn btn-xs btn-square btn-error justify-center items-center' :
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
                                      </div>
                                    )
                                }
                              </a>
                            ) }
                          </Formik>
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