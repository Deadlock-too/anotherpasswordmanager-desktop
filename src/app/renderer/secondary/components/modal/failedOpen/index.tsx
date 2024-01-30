import Modal from '../index'
import { useModalContext } from '../../../../common/contexts'
import { useTranslation } from 'react-i18next'

const FailedOpenDialog = () => {
  const { isFailedOpenModalOpen, setIsFailedOpenModalOpen } = useModalContext()
  const { t } = useTranslation()
  return (
    <Modal
      id="failedOpenModal"
      title={ t('FailedOpenDialog.Title')}
      handleReset={ () => setIsFailedOpenModalOpen(false) }
      isModalVisible={ isFailedOpenModalOpen }
    >
      <p className="text-center pt-4 pb-8 unselectable">
        { t('FailedOpenDialog.Message') }
      </p>
    </Modal>
  )
}

export default FailedOpenDialog