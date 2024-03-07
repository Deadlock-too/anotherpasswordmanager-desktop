import { ChangeEvent, ReactNode, useRef, useState } from 'react'
import { FormikErrors, FormikProps, FormikTouched } from 'formik'
import { Tooltip, TooltipContent, TooltipTrigger, useTimedTooltip } from '../../tooltip'
import { debounce } from 'lodash'
import { useClipboardContext } from '../../../contexts'

interface ITextInputProps {
  type: 'text' | 'password';
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
  copiableContent?: boolean;
  copyTooltipLabel?: string;
  preventDefaultOnClick?: boolean;
  customReadonlyComponent?: ReactNode;
}

interface IFormikTextInputProps {
  type: 'text' | 'password';
  label: string;
  field: string;
  placeholder: string
  formik: FormikProps<any>;
  readonly: boolean;
  disabled: boolean;
  copiableContent?: boolean;
  copyTooltipLabel?: string;
  preventDefaultOnClick?: boolean;
  customReadonlyComponent?: ReactNode;
}

const TextInput = ({
  type,
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
  preventDefaultOnClick,
  customReadonlyComponent
}: ITextInputProps) => {
  const { isOpen, handleTooltipOpen, handleTooltipClose } = useTimedTooltip(800)
  const { handleSetClipboard } = useClipboardContext()
  const [ isTyping, setIsTyping ] = useState(false)
  const debouncedInput = useRef(debounce((_) => {
    setIsTyping(false)
  }, 500)).current

  let inputComponent = <input
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
    className="input input-sm input-bordered w-full"
    disabled={ disabled }
    readOnly={ readonly }
  />

  //Add error tooltip wrapper
  inputComponent = <Tooltip
    placement="top"
    open={ !readonly && !isTyping && touched && typeof errors === 'string' && errors.length > 0 }
    onOpenChange={ () => {
    } } //Prevent to show the tooltip on hover
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

  //Add copy tooltip wrapper
  if (!customReadonlyComponent && copiableContent && readonly) {
    inputComponent = <Tooltip
      open={ isOpen }
      onOpenChange={ handleTooltipClose }
    >
      <TooltipTrigger className="w-full" onClick={ (e) => {
        e.preventDefault()
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
  }

  return <label
    className="form-control w-full"
    onMouseUp={ (event) => {
      if (preventDefaultOnClick)
        event.preventDefault()
      if (copiableContent && readonly && value !== undefined)
        handleSetClipboard(value)
    } }
  >
    <div className="label">
      <span className="label-text font-bold">
        { label }
      </span>
    </div>
    {
      readonly && customReadonlyComponent ?
        customReadonlyComponent :
        inputComponent
    }
  </label>
}

const FormikTextInput = ({
  type,
  label,
  field,
  placeholder,
  formik,
  readonly,
  disabled,
  copiableContent,
  copyTooltipLabel,
  preventDefaultOnClick,
  customReadonlyComponent
}: IFormikTextInputProps) => {
  return (
    <TextInput
      type={ type }
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
      customReadonlyComponent={ customReadonlyComponent }
      preventDefaultOnClick={ preventDefaultOnClick }
    />
  )
}

export { TextInput, FormikTextInput }