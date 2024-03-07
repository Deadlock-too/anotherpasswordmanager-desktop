import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FormikErrors, FormikProps, FormikTouched } from 'formik'
import { usePasswordToggle } from '../../../hooks/passwordVisibility'
import { Tooltip, TooltipContent, TooltipTrigger, useTimedTooltip } from '../../tooltip'
import { EyeIcon, EyeSlashIcon } from '../../../../../../assets/icons'
import { debounce } from 'lodash'
import { useClipboardContext } from '../../../contexts'

interface IPasswordInputProps {
  label: string;
  field: string;
  placeholder?: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  readonly: boolean;
  disabled: boolean;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
  errors?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
  tooltipHiddenLabel: string;
  tooltipVisibleLabel: string;
  copiableContent?: boolean;
  copyTooltipLabel?: string;
}

interface IFormikPasswordInputProps {
  label: string;
  field: string;
  placeholder: string
  formik: FormikProps<any>;
  readonly: boolean;
  disabled: boolean;
  tooltipHiddenLabel: string;
  tooltipVisibleLabel: string;
  copiableContent?: boolean;
  copyTooltipLabel?: string;
}

const PasswordInput = ({
  label,
  field,
  placeholder,
  handleChange,
  handleBlur,
  value,
  readonly,
  disabled,
  touched,
  errors,
  copiableContent,
  copyTooltipLabel,
  tooltipVisibleLabel,
  tooltipHiddenLabel
}: IPasswordInputProps) => {
  const { type, passwordVisibility, togglePasswordVisibility } = usePasswordToggle()
  const { isOpen, handleTooltipOpen, handleTooltipClose } = useTimedTooltip(800)
  const [ isHoveringButton, setIsHoveringButton ] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { handleSetClipboard } = useClipboardContext()
  const [ isTyping, setIsTyping ] = useState(false)
  const debouncedInput = useRef(debounce((_) => {
    setIsTyping(false)
  }, 500)).current

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.addEventListener('mouseover', () => setIsHoveringButton(true))
      buttonRef.current.addEventListener('mouseout', () => setIsHoveringButton(false))

      return () => {
        buttonRef.current?.removeEventListener('mouseover', () => setIsHoveringButton(true))
        buttonRef.current?.removeEventListener('mouseout', () => setIsHoveringButton(false))
      }
    }
  }, [])

  let inputComponent = (
    <div className="join w-full">
      <input
        type={ type }
        name={ field }
        onChange={ (event) => {
          handleChange(event)
          debouncedInput(event.target.value)
          setIsTyping(true)
        } }
        onBlur={ handleBlur }
        value={ value }
        placeholder={ placeholder }
        className="input input-sm input-bordered w-full pr-16 rounded-r-none"
        disabled={ disabled }
        readOnly={ readonly }
      />
      <Tooltip>
        <TooltipTrigger>
          <button
            ref={ buttonRef }
            type="button"
            className="relative top-0 right-0 rounded-l-none btn btn-sm btn-outline btn-info"
            disabled={ disabled }
            onClick={ (e) => {
              e.preventDefault()
              togglePasswordVisibility()
            } }
            onKeyUp={ (event) => {
              if (event.key === ' ') {
                event.preventDefault()
                togglePasswordVisibility()
              }
            } }
          >
            {
              passwordVisibility ?
                <EyeIcon/> :
                <EyeSlashIcon/>
            }
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div
            className="tooltip tooltip-base-100 tooltip-open"
            data-tip={ passwordVisibility ? tooltipHiddenLabel : tooltipVisibleLabel }
          />
        </TooltipContent>
      </Tooltip>
    </div>
  )

  //Add copy tooltip wrapper
  if (copiableContent && readonly) {
    inputComponent = (
      <Tooltip placement="top" open={ isOpen } onOpenChange={ () => {
        if (!isHoveringButton)
          handleTooltipClose()
      } }>
        <TooltipTrigger className="w-full" onClick={ (e) => {
          e.preventDefault()
          if (!isHoveringButton)
            handleTooltipOpen()
        } }>
          { inputComponent }
        </TooltipTrigger>
        <TooltipContent>
          <div
            className="tooltip tooltip-base-100 tooltip-open"
            data-tip={ copyTooltipLabel }
          />
        </TooltipContent>
      </Tooltip>
    )
  }

  //Add error tooltip wrapper
  inputComponent = (
    <Tooltip
      placement="top"
      open={ !readonly && !isTyping && touched && typeof errors === 'string' && errors.length > 0 }
      onOpenChange={ () => {} } //Prevent to show the tooltip on hover
    >
      <TooltipTrigger>
        { inputComponent }
      </TooltipTrigger>
      <TooltipContent>
        <div
          className="tooltip tooltip-error tooltip-open"
          data-tip={ errors }
        />
      </TooltipContent>
    </Tooltip>
  )

  return (
    <label className="form-control w-full" onMouseUp={ () => {
      if (!isHoveringButton && copiableContent && readonly && value !== undefined)
        handleSetClipboard(value)
    } }>
      <div className="label">
        <span className="label-text font-bold">
          { label }
        </span>
      </div>
      { inputComponent }
    </label>
  )
}

const FormikPasswordInput = ({
  label,
  field,
  placeholder,
  formik,
  readonly,
  disabled,
  copiableContent,
  copyTooltipLabel,
  tooltipVisibleLabel,
  tooltipHiddenLabel
}: IFormikPasswordInputProps) => {
  return (
    <PasswordInput
      label={ label }
      field={ field }
      placeholder={ placeholder }
      handleChange={ formik.handleChange }
      handleBlur={ formik.handleBlur }
      value={ formik.values[field] }
      readonly={ readonly }
      disabled={ disabled }
      touched={ formik.touched[field] }
      errors={ formik.errors[field] }
      copiableContent={ copiableContent }
      copyTooltipLabel={ copyTooltipLabel }
      tooltipVisibleLabel={ tooltipVisibleLabel }
      tooltipHiddenLabel={ tooltipHiddenLabel }
    />
  )
}

export { PasswordInput, FormikPasswordInput }