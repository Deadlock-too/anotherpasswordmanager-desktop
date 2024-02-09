import { useTranslation } from 'react-i18next'
import TitleBar from '../../../main/components/titlebar'

const FailedOpenScene = () => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col h-full justify-between">
      <h1 className="font-bold text-lg unselectable">{ t('FailedOpenDialog.Title') }</h1>
      <p className="text-center pt-4 pb-8 unselectable">
        { t('FailedOpenDialog.Message') }
      </p>
    </div>
  )
}

const InternalFailedOpen = () => {
  return (
    <>
      <TitleBar variant={ 'secondary' } onClose={ () => window.close() }/>
      <div className="main-content pt-2 px-6 pb-6">
        <FailedOpenScene/>
      </div>
    </>
  )
}

const FailedOpenWindow = () => {
  return (
    <InternalFailedOpen/>
  )
}

export default FailedOpenWindow