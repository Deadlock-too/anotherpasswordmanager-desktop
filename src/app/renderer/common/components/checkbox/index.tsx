import { FormikErrors, FormikProps, FormikTouched } from 'formik'
import { ChangeEvent } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip'

interface ICheckboxProps {
  label: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  value: string;
  readonly: boolean;
  disabled: boolean;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[];
  errors?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
}

interface IFormikCheckboxProps {
  label: string;
  field: string;
  formik: FormikProps<any>;
  readonly: boolean;
  disabled: boolean;
}

const Checkbox = ({
  handleChange,
  handleBlur,
  value,
  label,
  checked,
  field,
  readonly,
  disabled,
  errors
}: ICheckboxProps) => {
  let inputComponent =
    <label className="label">
      <span className="label-text">{ label }:</span>
      <input
        type="checkbox"
        className="checkbox checkbox-sm"
        name={ field }
        onChange={ handleChange }
        onBlur={ handleBlur }
        checked={ checked }
        value={ value }
        disabled={ disabled }
        readOnly={ readonly }
      />
    </label>

  //Add error tooltip wrapper
  inputComponent = <Tooltip
    placement="top"
    open={ !readonly && typeof errors === 'string' && errors.length > 0 }
    onOpenChange={ () => {
    } } //Prevent to show the tooltip on hover
  >
    <TooltipTrigger>
      { inputComponent }
    </TooltipTrigger>
    <TooltipContent>
      <div
        className="tooltip tooltip-error tooltip-open tooltip-top"
        data-tip={ errors }
      />
    </TooltipContent>
  </Tooltip>

  return (
    <div className="form-control w-52">
        { inputComponent }
    </div>
  )
}

const FormikCheckbox = ({ formik, field, label, readonly, disabled }: IFormikCheckboxProps) => {
  return (
    <Checkbox
      label={ label }
      field={ field }
      handleChange={ formik.handleChange }
      handleBlur={ formik.handleBlur }
      value={ formik.values[field] }
      checked={ formik.values[field] }
      readonly={ readonly }
      disabled={ disabled }
      touched={ formik.touched[field] }
      errors={ formik.errors[field] }
    />
  )
}

export { Checkbox, FormikCheckbox }