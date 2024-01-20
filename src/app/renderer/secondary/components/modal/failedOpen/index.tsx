import Modal from '../index'
import i18n from '../../../../../../i18n'
import { useModalContext } from '../../../../main/contexts'

const FailedOpenDialog = () => {
  const { isFailedOpenModalOpen, setIsFailedOpenModalOpen } = useModalContext()

  return (
    <Modal
      id="failedOpenModal"
      title={ i18n.t('FailedOpenDialog.Title')}
      handleReset={ () => setIsFailedOpenModalOpen(false) }
      isModalVisible={ isFailedOpenModalOpen }
    >
      <p className="text-center pt-4 pb-8 unselectable">
        { i18n.t('FailedOpenDialog.Message') }
      </p>
    </Modal>
  )
}

export default FailedOpenDialog