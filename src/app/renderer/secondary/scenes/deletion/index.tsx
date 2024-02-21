import TitleBar from '../../../main/components/titlebar'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { Loading } from '../../../common/components'
import { NamedIdentifiableType, RecordType } from '../../../common/types'
import IpcEventNames from '../../../../main/ipc/ipcEventNames'
import EventIdentifiers from '../../../../../consts/eventIdentifiers'

const DeletionScene = (props: { recordType: RecordType }) => {
  const [ recordInfo, setRecordInfo ] = useState<NamedIdentifiableType>()
  const { t } = useTranslation()

  useEffect(() => {
    window.electron.events.propagate(EventIdentifiers.GetDeletingRecordInfo, props.recordType)

    const getDeletionRecordInfoHandler = (recordInfo: NamedIdentifiableType) => {
      setRecordInfo(recordInfo)
    }
    window.electron.events.subscribeToResult(EventIdentifiers.GetDeletingRecordInfo, getDeletionRecordInfoHandler)

    return () => {
      window.electron.events.unsubscribeFromResult(EventIdentifiers.GetDeletingRecordInfo)
    }
  }, [])

  if (recordInfo === undefined)
    return <Loading/>

  //Truncate record name if it's too long
  const recordInfoName = recordInfo.Name.length > 32 ? recordInfo.Name.substring(0, 32) + '...' : recordInfo.Name

  const title = {
    [RecordType.Folder]: t('DeletionDialog.Folder.Title'),
    [RecordType.Entry]: t('DeletionDialog.Entry.Title')
  }[props.recordType]

  const message = {
    [RecordType.Folder]: (
      <>
        { t('DeletionDialog.Folder.Message.Pt1') }
        <a className="underline underline-offset-1 decoration-error decoration-2">{ recordInfoName }</a>
        { t('DeletionDialog.Folder.Message.Pt2') }
      </>
    ),
    [RecordType.Entry]: (
      <>
        { t('DeletionDialog.Entry.Message.Pt1') }
        <a className="underline underline-offset-1 decoration-error decoration-2">{ recordInfoName }</a>
        { t('DeletionDialog.Entry.Message.Pt2') }
      </>
    )
  }[props.recordType]


  const onSubmit = async () => {
    switch (props.recordType) {
      case RecordType.Folder:
        await window.electron.events.propagate(EventIdentifiers.DeleteFolder, recordInfo.Id)
        break
      case RecordType.Entry:
        await window.electron.events.propagate(EventIdentifiers.DeleteEntry, recordInfo.Id)
        break
    }
  }

  const onCancel = async () => {
    switch (props.recordType) {
      case RecordType.Folder:
        await window.electron.events.propagate(EventIdentifiers.CancelDeleteFolder)
        break
      case RecordType.Entry:
        await window.electron.events.propagate(EventIdentifiers.CancelDeleteEntry)
        break
    }
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <h1 className="font-bold text-lg unselectable">{ title }</h1>
      <p className="text-center unselectable">
        { message }
      </p>
      <div className="flex justify-end gap-2">
        <button
          className="btn btn-neutral ml-2"
          onClick={ () => {
            onCancel()
              .then(window.close)
          } }
        >
          { t('DeletionDialog.Cancel Button') }
        </button>
        <button
          className="btn btn-error"
          onClick={ () => {
            onSubmit()
              .then(window.close)
          } }
        >
          { t('DeletionDialog.Submit Button') }
        </button>
      </div>
    </div>
  )
}

const DeletionWindow = (props: { recordType: RecordType }) => {
  const handleClose = () => {
    (async () => {
      switch (props.recordType) {
        case RecordType.Folder:
          await window.electron.events.propagate(EventIdentifiers.CancelDeleteFolder)
          break
        case RecordType.Entry:
          await window.electron.events.propagate(EventIdentifiers.CancelDeleteEntry)
          break
      }
    })()
      .then(window.close)
  }

  useEffect(() => {
    window.electron.events.subscribe(IpcEventNames.App.Lock, handleClose)

    return () => {
      window.electron.events.unsubscribe(IpcEventNames.App.Lock)
    }
  }, [])

  return (
    <>
      <TitleBar variant={ 'secondary' } onClose={ handleClose }/>
      <div className="main-content pt-2 px-6 pb-6">
        <DeletionScene recordType={ props.recordType }/>
      </div>
    </>
  )
}

export default DeletionWindow