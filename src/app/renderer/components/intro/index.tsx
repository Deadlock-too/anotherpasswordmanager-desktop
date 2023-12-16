import { FolderOpenIcon, PlusIcon } from '../../../../assets/icons'
import { Component } from 'react'
import i18n from '../../../../i18n'

export default class Intro extends Component {
  render() {
    return (
      <div className='main-content flex flex-col justify-center items-center h-screen md:flex-row'>
        <div className='flex flex-col md:flex-row w-2/3 h-2/3'>
          <div className='grid flex-grow card place-items-center'>
            <div className='flex flex-col items-center justify-items-center gap-3 py-5'>
              <button className='btn' onClick={() => {
                window.dialog.fileManagement.open()
                  .then((result) => {
                    console.log(`Renderer result: ${result}`)
                  })
              }}>
                <FolderOpenIcon/>
                { i18n.t('Intro.Open Existing') }
              </button>
            </div>
          </div>
          <div className='divider md:divider-horizontal unselectable'>
            { i18n.t('Intro.Or') }
          </div>
          <div className='grid flex-grow card place-items-center'>
            <button className='btn' onClick={() => {
              window.dialog.fileManagement.save()
                .then((result) => {
                  console.log(`Renderer result: ${result}`)
                })
            }}>
              <PlusIcon/>
              { i18n.t('Intro.Add New') }
            </button>
          </div>
        </div>
      </div>
    )
  }
}