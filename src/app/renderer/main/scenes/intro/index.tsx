import { DirectoryOpenIcon, PlusIcon } from '../../../../../assets/icons'
import i18n from '../../../../../i18n'

const Intro = ({ onNewButtonClick }) => (
  <div className='main-content flex flex-col justify-center items-center h-screen md:flex-row'>
    <div className='flex flex-col md:flex-row w-2/3 h-2/3'>
      <div className='grid flex-grow card place-items-center'>
        <button className='btn' onClick={ window.dialog.fileManagement.open } tabIndex={ 1 }>
          <DirectoryOpenIcon/>
          { i18n.t('Intro.Open Existing') }
        </button>
      </div>
      <div className='divider md:divider-horizontal unselectable'>
        { i18n.t('Intro.Or') }
      </div>
      <div className='grid flex-grow card place-items-center'>
        <button className='btn' onClick={ onNewButtonClick } tabIndex={ 2 }>
          <PlusIcon/>
          { i18n.t('Intro.Add New') }
        </button>
      </div>
    </div>
  </div>
)

export default Intro