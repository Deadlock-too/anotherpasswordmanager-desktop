import { ColumnBase } from '../index'
import DetailView from '../../detailView'
import { useTranslation } from 'react-i18next'
import { ScrollContextProvider } from '../../../../common/contexts'

const InternalDetailsColumn = () => {
  const { t } = useTranslation()
  const column = new ColumnBase({
    style: {
      label: t('Main.Detail'),
      width: 'w-6/12',
      margin: 'ml-1',
      unselectableContent: false
    },
    children: <DetailView/>
  })

  return (
    column.render()
  )
}

const DetailsColumn = () => {
  return (
    <ScrollContextProvider>
      <InternalDetailsColumn/>
    </ScrollContextProvider>
  )
}


export default DetailsColumn