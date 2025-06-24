import { useState, useEffect, useRef } from 'react'
import { Formik, Form, Field } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import * as Yup from 'yup'
import axios from 'axios'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import { Button, Form as BootstrapForm } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getAuthHeader } from '../../pages/MainPage.jsx'
import routes from '../../routes.js'
import { setCurrentChannel } from '../../slices/channelsSlice.js'
import { setAddModalActive } from '../../slices/modalSlice.js'
import { useNavigate } from 'react-router-dom'

const AddModalWindow = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const isActive = useSelector(state => state.modal.isAddModalActive)
  // eslint-disable-next-line no-unused-vars
  const [authFailed, setAuthFailed] = useState(false)
  const currentChannels = useSelector(state => state.channels.channels)
  const channelNames = currentChannels.map(channel => channel.name)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isActive])

  useEffect(() => {
    if (currentChannels && isActive) {
      dispatch(setCurrentChannel(currentChannels[currentChannels.length - 1]))
    }
  }, [currentChannels])

  const channelScheme = Yup.object().shape({
    channelName: Yup.string()
      .min(3, t('errors.nameLengthError'))
      .max(20, t('errors.nameLengthError'))
      .notOneOf(channelNames, t('errors.alreadyExistsChannelError'))
      .required(t('errors.requiredField')),
  })

  const sendNewChannelRequest = async (values, { setSubmitting }) => {
    setAuthFailed(false)
    try {
      const newChannel = {
        name: values.channelName,
        removable: true,
        id: _.uniqueId(),
      }
      await axios.post(routes.channelsPath(), newChannel, {
        headers: getAuthHeader(),
      })
      setSubmitting(false)
      dispatch(setAddModalActive(false))
    }
    catch (err) {
      if (err.isAxiosError) {
        if (err.response?.status === 401) {
          toast.error(t('errors.userLoginError'))
          navigate('/login', { state: { from: '/main' } })
          return
        }
        toast.error(t('errors.serverLoadDataError'))
        return
      }
      else {
        toast.error(t('errors.networkError'))
      }
      setSubmitting(false)
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
              <div className="modal-title h4">{t('modalWindow.windowsTitles.addTitle')}</div>
              <button
                type="button"
                className="btn btn-close"
                onClick={() => dispatch(setAddModalActive(false))}
              />
            </div>
            <div className="modal-body">
              <Formik
                initialValues={{ channelName: '' }}
                validationSchema={channelScheme}
                onSubmit={(values, { setSubmitting }) => sendNewChannelRequest(values, { setSubmitting })}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <BootstrapForm.Group className="mb-3">
                      <Field
                        as={BootstrapForm.Control}
                        type="text"
                        id="name"
                        name="channelName"
                        isInvalid={!!errors.channelName && touched.channelName}
                        ref={inputRef}
                        autoComplete="off"
                      />
                      {errors.channelName && touched.channelName && (
                        <div className="invalid-feedback">{errors.channelName}</div>
                      )}
                      <label className="visually-hidden" htmlFor="name">
                        {t('modalWindow.windowsTitles.channelName')}
                      </label>
                    </BootstrapForm.Group>
                    <div className="d-flex justify-content-end">
                      <Button
                        type="button"
                        className="me-2 btn btn-secondary"
                        onClick={() => dispatch(setAddModalActive(false))}
                      >
                        {t('modalWindow.windowsButtons.cancelButton')}
                      </Button>
                      <Button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {t('modalWindow.windowsButtons.sendButton')}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  )
}

export default AddModalWindow
