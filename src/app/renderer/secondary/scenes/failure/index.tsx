import { useTranslation } from 'react-i18next'
import TitleBar from '../../../main/components/titlebar'
import { upperFirst } from 'lodash'
import { useLockHandler } from '../../hooks/lockHandler'
import { useFileNameHelper } from '../../hooks/fileNameHelper'
import { capitalizeFirstLetter } from '../../../../../utils'

const FailureScene = (props: IFailureWindowProps) => {
  const { t } = useTranslation()
  const title = t(`FailureDialog.${ upperFirst(props.variant) }.Title`)
  const message = t(`FailureDialog.${ upperFirst(props.variant) }.Message`)

  return (
    <div className="flex flex-col h-full justify-between">
      <h1 className="font-bold text-lg unselectable">{ title }</h1>
      <p className="text-center pt-4 pb-8 unselectable">
        { message }
      </p>
    </div>
  )
}

interface IFailureWindowProps {
  variant: 'open' | 'unlock'
}

const FailureWindow = (props: IFailureWindowProps) => {
  const { t } = useTranslation()
  const { fileName, openingFileName } = useFileNameHelper()
  const { handleClose } = useLockHandler(window.close)
  const title = t(`FailureDialog.${ capitalizeFirstLetter(props.variant) }.Dialog Title`) + ` - ${ props.variant === 'open' ? openingFileName : fileName }`

  return (
    <>
      <TitleBar title={ title } variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6 pb-6">
        <FailureScene { ...props } />
      </div>
    </>
  )
}

export default FailureWindow