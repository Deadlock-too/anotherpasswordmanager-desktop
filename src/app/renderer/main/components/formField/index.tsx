import { FormikProps } from 'formik'
import { HTMLInputTypeAttribute } from 'react'

const DEFAULT_FORM_TYPE = 'text'
const DEFAULT_READONLY = false
const DEFAULT_PLACEHOLDER = 'Enter text here'
const DEFAULT_UNSELECTABLE = false

export interface FormFieldProps {
  formik: FormikProps<any>
  type?: HTMLInputTypeAttribute | undefined
  field: string
  label: string
  placeholder?: string
  unselectable?: boolean
  readonly? : boolean
  copyValueOnClick?: boolean
}

const FormField = (props: FormFieldProps) => {
  const propErrors = props.formik.errors[props.field]
  const unselectable = props.unselectable ?? DEFAULT_UNSELECTABLE
  const readonly = props.readonly ?? DEFAULT_READONLY
  const placeHolder = props.placeholder ?? DEFAULT_PLACEHOLDER

  return (
    <label className="form-control w-full" onClick={() => {
      if (props.copyValueOnClick) {
        window.clipboard.write(props.formik.values[props.field])
      }
    }}>
      <div className="label">
        <span className='label-text'>{ props.label }</span>
      </div>
      <input
        type={ props.type ?? DEFAULT_FORM_TYPE }
        name={ props.field }
        onChange={ props.formik.handleChange }
        onBlur={ props.formik.handleBlur }
        value={ props.formik.values[props.field] }
        placeholder={ placeHolder }
        className="input input-sm input-bordered w-full"
        disabled={ props.formik.isSubmitting }
        aria-hidden={ unselectable }
        tabIndex={ unselectable ? -1 : 0 }
        readOnly={ readonly }
      />
      {
        props.formik.touched[props.field] && typeof propErrors === 'string' ?
          <div className="label">
            <span className="label-text-alt text-error">{ propErrors }</span>
          </div>
          : null
      }
    </label>
  )
}

export default FormField