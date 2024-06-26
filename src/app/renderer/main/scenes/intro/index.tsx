import { DirectoryOpenIcon, PlusIcon } from '../../../../../assets/icons'
import { useTranslation } from 'react-i18next'

const Intro = ({ onNewButtonClick }) => {
  const { t } = useTranslation()

  // TODO ID-16
  return (
    <div className="main-content flex flex-col justify-center items-center h-screen md:flex-row">
      <div className="flex flex-col md:flex-row w-2/3 h-2/3">
        <div className="grid flex-grow card place-items-center">
          <button className="btn" onClick={ window.app.file.openDialog } tabIndex={ 1 }>
            <DirectoryOpenIcon/>
            { t('Intro.Open Existing') }
          </button>
        </div>
        <div className="divider md:divider-horizontal unselectable">
          { t('Intro.Or') }
        </div>
        <div className="grid flex-grow card place-items-center">
          <button className="btn" onClick={ onNewButtonClick } tabIndex={ 2 }>
            <PlusIcon/>
            { t('Intro.Add New') }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Intro