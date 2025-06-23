import { useState, useEffect } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Button } from 'react-bootstrap'
import { getAuthHeader } from '../../pages/MainPage.jsx'
import routes from '../../routes.js'
import { setRemoveModalActive } from '../../slices/modalSlice.js'
import { setCurrentChannel } from '../../slices/channelsSlice.js'

const RemoveModalWindow = () => {
  // eslint-disable-next-line no-unused-vars
  const [authFailed, setAuthFailed] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isActive = useSelector(state => state.modal.isRemoveModalActive)
  const idForRemove = useSelector(state => state.modal.idForRemove)
  const currentChannels = useSelector(state => state.channels.channels)
  const defaultChannel = { id: '1', name: 'general', removable: false }

  useEffect(() => {
    if (currentChannels && isActive) {
      dispatch(setCurrentChannel(defaultChannel))
    }
  }, [currentChannels])

  const deleteHandler = async () => {
    setAuthFailed(false)
    try {
      await axios.delete(routes.channelPath(idForRemove), { headers: getAuthHeader() })
      dispatch(setRemoveModalActive(false))
    } catch (err) 
    {
      if (err.isAxiosError) {
        toast.error(t('errors.serverLoadDataError'))
      } else 
      {
        toast.error(t('errors.networkError'))
      }
      setAuthFailed(true)
    }
  }

  if (!isActive) {
    return null
  }

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div
        className={`fade modal ${isActive ? 'show' : ''}`}
        style={{ display: isActive ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-title h4">{t('modalWindow.windowsTitles.removeTitle')}</div>
              <button
                type="button"
                className="btn btn-close"
                onClick={() => dispatch(setRemoveModalActive(false))}
              />
            </div>
            <div className="modal-body">
              <p className="lead">
                {t('modalWindow.windowsTitles.clarifyingRemoveTitle')}
              </p>
              <div className="d-flex justify-content-end">
                <Button
                  type="button"
                  className="me-2 btn btn-secondary"
                  onClick={() => dispatch(setRemoveModalActive(false))}
                >
                  {t('modalWindow.windowsButtons.cancelButton')}
                </Button>
                <Button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteHandler()}
                >
                  {t('modalWindow.windowsButtons.removeButton')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default RemoveModalWindow
