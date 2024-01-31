import { ChangeEvent } from 'react'
import { FormikErrors, FormikProps, FormikTouched } from 'formik'
import { usePasswordToggle } from '../../../../main/hooks/passwordVisibility'
import { Tooltip, TooltipContent, TooltipTrigger, useTimedTooltip } from '../../tooltip'
import { EyeIcon, EyeSlashIcon } from '../../../../../../assets/icons'

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

  let inputComponent = (
    <input
      type={ type }
      name={ field }
      onChange={ handleChange }
      onBlur={ handleBlur }
      value={ value }
      placeholder={ placeholder }
      className="input input-sm input-bordered w-full pr-16 rounded-r-none"
      disabled={ disabled }
      readOnly={ readonly }
    />
  )

  if (copiableContent && readonly) {
    inputComponent = (
      <Tooltip open={ isOpen } onOpenChange={ handleTooltipClose }>
        <TooltipTrigger className='w-full' onClick={ (e) => {
          e.preventDefault()
          handleTooltipOpen()
        } }>
          { inputComponent }
        </TooltipTrigger>
        <TooltipContent>
          <div className="tooltip tooltip-base-100 tooltip-open"
               data-tip={ copyTooltipLabel }/>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <label className="form-control w-full" onClick={ () => {
      if (copiableContent && readonly && value !== undefined)
        window.clipboard.write(value)
    } }>
      <div className="label">
        <span className="label-text font-bold">
          { label }
        </span>
      </div>
      <div className="join">
        {
          inputComponent
        }
        <Tooltip>
          <TooltipTrigger>
            <button
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
            <div className="tooltip tooltip-base-100 tooltip-open"
                 data-tip={ passwordVisibility ? tooltipHiddenLabel : tooltipVisibleLabel }/>
          </TooltipContent>
        </Tooltip>
      </div>
      {
        touched && errors ?
          <div className="label">
            <span className="label-text-alt text-error">
              { `${ errors }` }
            </span>
          </div>
          : null
      }
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