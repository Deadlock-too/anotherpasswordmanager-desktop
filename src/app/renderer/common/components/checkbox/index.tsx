import { FormikProps } from 'formik'
import { ChangeEvent } from 'react'

interface ICheckboxProps {
  label: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  value: string;
}

interface IFormikCheckboxProps {
  label: string;
  field: string;
  formik: FormikProps<any>;
}

const Checkbox = ({ handleChange, value, label, checked, field }: ICheckboxProps) => {
  return (
    <div className="form-control w-52">
      <label className="label">
        <span className="label-text">{ label }:</span>
        <input type="checkbox" className="checkbox checkbox-sm"
               name={ field }
               onChange={ handleChange }
               checked={ checked }
               value={ value }
        />
      </label>
    </div>
  )
}

const FormikCheckbox = ({ formik, field, label }: IFormikCheckboxProps) => {
  return (
    <Checkbox
      label={ label }
      field={ field }
      handleChange={ formik.handleChange }
      value={ formik.values[field] }
      checked={ formik.values[field] }
    />
  )
}

export { Checkbox, FormikCheckbox }