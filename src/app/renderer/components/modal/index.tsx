import { CloseIcon } from '../../../../assets/icons'

const Modal = ({ id, title, children, isModalVisible, handleReset }) => {
  return (
    <dialog id={ id } className='modal'>
      <div className='modal-box'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-lg unselectable'>{ title }</h3>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'
                    onClick={ () => handleReset() }
                    tabIndex={ isModalVisible ? 1 : -1 }
            ><CloseIcon/></button>
          </form>
        </div>
        <div className='modal-action flex flex-col h-full'>
          { children }
        </div>
      </div>
      <form method='dialog' className='modal-backdrop'>
        <button className='cursor-default'
                onClick={ () => handleReset() }
                tabIndex={-1}
        />
      </form>
    </dialog>
  )
}

export default Modal