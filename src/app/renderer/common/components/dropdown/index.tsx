import { FormikProps } from 'formik'
import { useRef } from 'react'
import { ScrollableDiv } from '../' //TODO ID-9

interface IDropdownProps {
  label: string;
  field: string;
  options: { value: string, label: string }[];
  value: string;
  setFieldValue: (field: string, value: any) => void;
  disabled?: boolean;
}

interface IFormikDropdownProps {
  label: string;
  field: string;
  options: { value: string, label: string }[];
  formik: FormikProps<any>;
  disabled?: boolean;
}

const Dropdown = ({ field, label, options, disabled, value, setFieldValue }: IDropdownProps) => {
  const dropdownRef = useRef<HTMLDetailsElement>(null)
  const currentOption = options.find(option => option.value === value)

  return (
    <div className="form-control w-48">
      <label className="label gap-3">
        <span className="label-text">{ label }:</span>
        {
          disabled ?
            <button tabIndex={ 0 } className="m-1 btn btn-sm btn-outline min-w-fit w-36" disabled={ true }>
              { currentOption?.label }
            </button> :
            <details className="dropdown" ref={ dropdownRef }>
              <summary tabIndex={ 0 } className="m-1 btn btn-sm btn-outline min-w-fit w-36">
                { currentOption?.label }
              </summary>
              <ul tabIndex={ 0 } className="shadow menu z-[1] dropdown-content bg-base-100 rounded-md w-44">
                <ScrollableDiv height="max-h-52">
                  {/* Made a second <ul> because using the scrollable div prevents the possibility to apply the gap style */ }
                  <ul className="flex flex-col gap-1">
                    {
                      options.map((option) => (
                        <li key={ option.value }
                            className={ value === option.value ? 'selected-setting' : '' }>
                          <a onClick={ () => {
                            setFieldValue(field, option.value)
                            dropdownRef.current?.removeAttribute('open')
                          } }>{ option.label }</a>
                        </li>
                      ))
                    }
                  </ul>
                </ScrollableDiv>
              </ul>
            </details>
        }
      </label>
    </div>
  )
}

const FormikDropdown = ({ formik, field, label, options, disabled }: IFormikDropdownProps) => {
  return (
    <Dropdown
      field={ field }
      label={ label }
      options={ options }
      disabled={ disabled }
      value={ formik.values[field] }
      setFieldValue={ formik.setFieldValue }
    />
  )
}

export { Dropdown, FormikDropdown }