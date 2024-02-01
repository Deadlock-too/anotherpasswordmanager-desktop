import { ChangeEvent, ReactNode } from 'react'
import { FormikErrors, FormikProps, FormikTouched } from 'formik'
import { Tooltip, TooltipContent, TooltipTrigger, useTimedTooltip } from '../../tooltip'

interface ITextInputProps {
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

  let inputComponent = (
    (
      <>
        <input
          type="text"
          name={ field }
          onChange={ handleChange }
          onBlur={ handleBlur }
          value={ value }
          placeholder={ placeholder }
          className="input input-sm input-bordered w-full"
          disabled={ disabled }
          readOnly={ readonly }
        />
        {
          touched && errors ?
            <div className="label">
              <span className="label-text-alt text-error">
                { `${ errors }` }
              </span>
            </div>
            : null
        }
      </>
    )
  )


  if (!customReadonlyComponent && copiableContent && readonly) {
    inputComponent = (
      <Tooltip open={ isOpen } onOpenChange={ handleTooltipClose }>
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
    )
  }

  return (
    <label className="form-control w-full" onClick={ (event) => {
      if (preventDefaultOnClick)
        event.preventDefault()
      if (copiableContent && readonly && value !== undefined)
        window.clipboard.write(value)
    } }>
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
  )
}

const FormikTextInput = ({
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