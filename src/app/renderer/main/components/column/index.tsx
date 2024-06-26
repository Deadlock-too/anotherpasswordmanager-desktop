import { NamedIdentifiableType, UUID } from '../../../common/types'
import { Component, ReactNode, useEffect, useRef, useState } from 'react'
import { CheckIcon, CrossIcon, PencilIcon, PlusIcon, TrashIcon } from '../../../../../assets/icons'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useLocalContext } from '../../../common/contexts'

export interface BaseColumnProps<T extends NamedIdentifiableType> {
  style: {
    label: string | undefined
    margin: 'mr-1' | 'mr-1 ml-1' | 'ml-1'
    unselectableContent: boolean
    addButton?: {
      onClick: () => void
      disabled: boolean
    }
  }
  children?: ReactNode
}

export class ColumnBase<T extends NamedIdentifiableType> extends Component {
  children?: ReactNode

  style: {
    label: string | undefined
    margin: 'mr-1' | 'mr-1 ml-1' | 'ml-1'
    unselectableContent: boolean
    addButton?: {
      onClick: () => void
      disabled: boolean
    }
  }

  constructor(props: BaseColumnProps<T>) {
    super(props)
    this.style = props.style
    this.children = props.children
  }

  render() {
    const divRef = useRef<HTMLDivElement>(null)
    const [ isScrollable, setIsScrollable ] = useState(false)
    const { setIsLocallyScrolling } = useLocalContext()
    let scrollTimeout: NodeJS.Timeout | undefined = undefined

    useEffect(() => {
      const div = divRef.current
      if (div) {
        const resizeObserver = new ResizeObserver(() => {
          setIsScrollable(div.scrollHeight > div.clientHeight)
        })
        resizeObserver.observe(div)

        const onScroll = () => {
          // Clear the timeout if it's already been set
          if (scrollTimeout) {
            clearTimeout(scrollTimeout)
          }

          setIsLocallyScrolling(true)

          scrollTimeout = setTimeout(() => {
            setIsLocallyScrolling(false)
            scrollTimeout = undefined
          }, 100)
        }

        if (setIsLocallyScrolling !== undefined) {
          div.addEventListener('scroll', onScroll)
        }

        return () => {
          resizeObserver.unobserve(div)
          div.removeEventListener('scroll', onScroll)
        }
      }
    }, [ this.children ])

    return (
      <div
        className={ `${ this.style.margin } h-full flex flex-col ${ this.style.unselectableContent ? 'unselectable' : '' }` }>
        <div className="flex flex-row justify-between items-center">
          <label className={ `pl-1.5 font-bold ${ this.style.unselectableContent ? '' : 'unselectable' }` }>
            { this.style.label }
          </label>
          {
            this.style.addButton &&
            <button
              className="btn btn-xs btn-circle"
              onClick={ this.style.addButton.onClick }
              disabled={ this.style.addButton.disabled }
            >
              <PlusIcon/>
            </button>
          }
        </div>
        <div className="divider m-0"/>
        <div className="bg-base-200 w-full flex-grow h-full rounded p-2 scrollbar-wrapper">
          <div ref={ divRef } className={ isScrollable ? 'scrollbar pr-2' : 'scrollbar' }>
            { this.children }
          </div>
        </div>
      </div>
    )
  }
}

export interface ColumnContentProps<T extends NamedIdentifiableType> {
  elements: T[]
  actions: {
    setHoveringId: (id: UUID | null) => void
    setDeleting: (element: T) => void
    setEditingId: (id: UUID | null) => void
    handleUpdate: (element: T) => void
    setElementName: (element: T, name: string) => void
    showDeletionWindow: () => void
    handleSelection: (element: T) => void
  },
  contextData: {
    selectedId: UUID | null
    hoveringId: UUID | null
    editingId: UUID | null
    getElementName: (element: T) => string
    getUniqueElementName: (element: T, elements: T[]) => string
  },
  i18n: {
    missingElementsMessage: string
    addElementMessage: string
  }
}

export class ColumnContentBase<T extends NamedIdentifiableType> extends Component {
  elements: T[] = []
  actions: {
    setHoveringId: (id: UUID | null) => void
    setDeleting: (element: T) => void
    setEditingId: (id: UUID | null) => void
    handleUpdate: (element: T) => void
    setElementName: (element: T, name: string) => void
    showDeletionWindow: () => void
    handleSelection: (element: T) => void
  }
  contextData: {
    selectedId: UUID | null
    hoveringId: UUID | null
    editingId: UUID | null
    getElementName: (element: T) => string
    getUniqueElementName: (element: T, elements: T[]) => string
  }
  i18n: {
    missingElementsMessage: string
    addElementMessage: string
  }

  constructor(props: ColumnContentProps<T>) {
    super(props)
    this.elements = props.elements
    this.actions = props.actions
    this.contextData = props.contextData
    this.i18n = props.i18n
  }

  render() {
    const [ disableElementSelection, setDisableElementSelection ] = useState(false)
    const { t } = useTranslation()

    const textRefs = useRef<(HTMLDivElement | null)[]>([])
    const liRefs = useRef<(HTMLLIElement | null)[]>([])
    const editBtnRefs = useRef<(HTMLButtonElement | null)[]>([])
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      textRefs.current = textRefs.current.slice(0, this.elements.length)
      liRefs.current = liRefs.current.slice(0, this.elements.length)
      editBtnRefs.current = editBtnRefs.current.slice(0, this.elements.length)

      this.elements.forEach((_, i) => {
        if (!textRefs.current[i]) {
          textRefs.current[i] = null
        }
        if (!liRefs.current[i]) {
          liRefs.current[i] = null
        }
        if (!editBtnRefs.current[i]) {
          editBtnRefs.current[i] = null
        }
      })

      this.elements.forEach((_, i) => {
        const textElement = textRefs.current[i]
        const liElement = liRefs.current[i]
        const buttonElement = editBtnRefs.current[i]

        if (textElement && liElement && buttonElement) {
          liElement.addEventListener('mouseenter', () => {
            let scrollAmount = (textElement.scrollWidth - textElement.offsetWidth)
            if (scrollAmount <= 0) return
            /**
             * Increase scroll amount to prevent text from being cut off by the buttons
             * Increased by 24px (icon width) * 2 (number of icons)
             **/
            scrollAmount += (24 * 2)
            const scrollTime = scrollAmount / 7.5
            textElement.style.setProperty('--scroll-amount', `-${ scrollAmount }px`)
            textElement.style.setProperty('--scroll-time', `${ scrollTime }s`)
            textElement.classList.add('truncate-scroll')
          })

          liElement.addEventListener('mouseleave', () => textElement.classList.remove('truncate-scroll'))
          buttonElement.addEventListener('click', () => textElement.classList.remove('truncate-scroll'))
        }
      })
    })

    return (
      this.elements?.length === 0 ?
        <div className="h-full justify-center flex flex-col">
          <h1 className="text-center font-bold">
            { this.i18n.missingElementsMessage }
          </h1>
          <h2 className="text-center font-thin pr-5 pl-5">
            { this.i18n.addElementMessage }
          </h2>
        </div>
        :
        <ul className="menu menu-md bg-base-300 w-full flex-grow rounded-box gap-1">
          {
            this.elements.map((child, i) => {
              const isHovered = child.Id === this.contextData.hoveringId
              const isSelected = child.Id === this.contextData.selectedId
              const isEditing = child.Id === this.contextData.editingId

              return (
                <li
                  key={ child.Id + child.Name }
                  className={ isSelected ? 'selected' : '' }
                  onMouseEnter={ () => {
                    this.actions.setHoveringId(child.Id)
                  } }
                  onMouseLeave={ () => {
                    this.actions.setHoveringId(null)
                  } }
                  ref={ el => liRefs.current[i] = el }
                >
                  <Formik
                    //TODO ID-14
                    initialValues={ { title: this.contextData.getElementName(child) } }
                    validate={
                      values => {
                        const errors: any = {}
                        if (!values.title) {
                          errors.title = t('Common.Validations.Required field')
                        }
                        return errors
                      }
                    }
                    onSubmit={ (values, { setSubmitting }) => {
                      setTimeout(() => {
                        this.actions.setElementName(child, values.title)
                        this.actions.handleUpdate(child)
                        setSubmitting(false)
                      }, 400)
                    } }
                    onReset={ () => {
                      this.actions.setEditingId(null)
                    } }
                  >
                    { ({
                      values,
                      errors,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting,
                      handleReset,
                    }) => (
                      <a key={ child.Id } onClick={ () => {
                        if (disableElementSelection || this.contextData.editingId) return
                        this.actions.handleSelection(child)
                      } }
                         className="justify-between items-center"
                      >
                        <div className="flex-grow truncate" ref={ el => textRefs.current[i] = el }>
                          {
                            child.Id == this.contextData.editingId ?
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
                                  }
                                } }
                                spellCheck={ false }
                              />
                              :
                              this.contextData.getUniqueElementName(child, this.elements)
                          }
                        </div>
                        {
                          isEditing ?
                            (
                              <div className="flex gap-1 -mr-2.5 -mt-1 -mb-1">
                                <button
                                  type="submit"
                                  className="btn btn-xs btn-square btn-neutral justify-center items-center"
                                  onClick={ () => {
                                    handleSubmit()
                                    this.actions.setEditingId(null)
                                  } }
                                  onMouseEnter={ () => setDisableElementSelection(true) }
                                  onMouseLeave={ () => setDisableElementSelection(false) }
                                >
                                  <CheckIcon/>
                                </button>
                                <button
                                  type="reset"
                                  className="btn btn-xs btn-square btn-neutral justify-center items-center"
                                  onClick={ () => {
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
                                    this.actions.setEditingId(child.Id)
                                    setTimeout(() => {
                                      inputRef.current?.focus()
                                    }, 100)
                                  } }
                                  onMouseEnter={ () => setDisableElementSelection(true) }
                                  onMouseLeave={ () => setDisableElementSelection(false) }
                                  ref={ el => editBtnRefs.current[i] = el }
                                >
                                  <PencilIcon/>
                                </button>
                                <button
                                  className={ isHovered ?
                                    'btn btn-xs btn-square btn-error justify-center items-center' :
                                    'hidden'
                                  }
                                  onClick={ () => {
                                    this.actions.setDeleting(child)
                                    this.actions.showDeletionWindow()
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
    )
  }
}