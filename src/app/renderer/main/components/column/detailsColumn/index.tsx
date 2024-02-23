import { ColumnBase } from '../index'
import DetailView from '../../detailView'
import { useTranslation } from 'react-i18next'
import { LocalContextProvider } from '../../../../common/contexts'

const InternalDetailsColumn = ({ columnSize }) => {
  const { t } = useTranslation()
  const column = new ColumnBase({
    style: {
      label: t('Main.Detail'),
      margin: 'ml-1',
      unselectableContent: false
    },
    children: <DetailView columnSize={ columnSize }/>
  })

  return (
    column.render()
  )
}

const DetailsColumn = ({ columnSize }) => {
  return (
    <LocalContextProvider>
      <InternalDetailsColumn columnSize={ columnSize }/>
    </LocalContextProvider>
  )
}


export default DetailsColumn