import { ChangeEvent } from 'react'
import { FormikProps } from 'formik'

interface IToggleProps {
  label: string;
  field: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  value: string;
}

interface IFormikToggleProps {
  label: string;
  name: string;
  formik: FormikProps<any>;
}

const Toggle = ({ handleChange, value, label, checked, field }: IToggleProps) => {
  return (
    <div className="form-control w-52">
      <label className="label">
        <span className="label-text">{ label }:</span>
        <input type="checkbox" className="toggle toggle-sm"
               name={ field }
               onChange={ handleChange }
               checked={ checked }
               value={ value }
        />
      </label>
    </div>
  )
}

const FormikToggle = ({ formik, name, label }: IFormikToggleProps) => {
  return (
    <Toggle
      label={ label }
      field={ name }
      handleChange={ formik.handleChange }
      value={ formik.values[name] }
      checked={ formik.values[name] }
    />
  )
}

export { Toggle, FormikToggle }