import { ColumnBase } from '../index'
import DetailView from '../../detailView'
import { useTranslation } from 'react-i18next'

const DetailsColumn = () => {
  const { t } = useTranslation()
  const column = new ColumnBase({
    style: {
      label: t('Main.Detail'),
      width: 'w-6/12',
      margin: 'ml-1',
      unselectableContent: false
    },
    children: <DetailView />
  })

  return (
    column.render()
  )
}

export default DetailsColumn