import { ColumnBase } from '../index'
import DetailView from '../../detailView'
import i18n from '../../../../../i18n'

const DetailsColumn = () => {
  const column = new ColumnBase({
    style: {
      label: i18n.t('Main.Detail'),
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