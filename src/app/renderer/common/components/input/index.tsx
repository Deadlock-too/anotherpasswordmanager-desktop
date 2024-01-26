import { ChangeEvent } from 'react'
import { FormikProps } from 'formik'

interface ITextInputProps {
  preLabel: string;
  afterLabel: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
}

interface IFormikTextInputProps {
  preLabel: string;
  afterLabel: string;
  field: string;
  formik: FormikProps<any>;
  placeholder?: string;
  disabled?: boolean;
}

const NumberInput = ({ preLabel, afterLabel, field, handleChange, value, placeholder, disabled }: ITextInputProps) => {
  return (
    <div className="form-control w-52">
      <label className="label">
        <span className="label-text">{ preLabel }:</span>
        <input type="number" className="input input-xs w-16"
               name={ field }
               onChange={ handleChange }
               value={ value }
               placeholder={ placeholder }
               disabled={ disabled }
        />
        { afterLabel ? <span className="label-text pl-2">{ afterLabel }</span> : null }
      </label>
    </div>
  )
}

const FormikNumberInput = ({ formik, field, preLabel, afterLabel, placeholder, disabled }: IFormikTextInputProps) => {
  return (
    <NumberInput
      preLabel={ preLabel }
      afterLabel={ afterLabel }
      field={ field }
      handleChange={ formik.handleChange }
      value={ formik.values[field] }
      placeholder={ placeholder }
      disabled={ disabled }
    />
  )
}

export { NumberInput, FormikNumberInput }