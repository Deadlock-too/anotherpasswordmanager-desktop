import { ChangeEvent } from 'react'
import { FormikProps } from 'formik'

interface INumberInputProps {
  preLabel: string;
  afterLabel: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
}

interface IFormikNumberInputProps {
  preLabel: string;
  afterLabel: string;
  field: string;
  formik: FormikProps<any>;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const NumberInput = ({
  preLabel,
  afterLabel,
  field,
  handleChange,
  value,
  placeholder,
  readonly,
  disabled,
  min,
  max
}: INumberInputProps) => {
  return (
    <div className="form-control w-48">
      <label className="label gap-3">
        <span className="label-text">{ preLabel }:</span>
        <input
          type="number"
          className="input input-xs w-16 disabled:cursor-default"
          name={ field }
          onChange={ (event) => {
            if (min && parseInt(event.target.value) < min) {
              event.target.value = min.toString()
            }
            if (max && parseInt(event.target.value) > max) {
              event.target.value = max.toString()
            }
            handleChange(event)
          } }
          value={ value }
          placeholder={ placeholder }
          readOnly={ readonly }
          disabled={ disabled }
          min={ min }
          max={ max }
        />
        { afterLabel ? <span className="label-text pl-2">{ afterLabel }</span> : null }
      </label>
    </div>
  )
}

const FormikNumberInput = ({
  formik,
  field,
  preLabel,
  afterLabel,
  placeholder,
  readonly,
  disabled,
  min,
  max
}: IFormikNumberInputProps) => {
  return (
    <NumberInput
      preLabel={ preLabel }
      afterLabel={ afterLabel }
      field={ field }
      handleChange={ formik.handleChange }
      value={ formik.values[field] }
      placeholder={ placeholder }
      readonly={ readonly }
      disabled={ disabled }
      min={ min }
      max={ max }
    />
  )
}

export { NumberInput, FormikNumberInput }