import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ToastContainer, toast } from 'react-toastify'
import { Button, Form as BootstrapForm } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logIn } from '../slices/authSlice.js'
import routes from '../routes.js'

const LoginPage = () => {
  const { t } = useTranslation()

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(t('errors.requiredField')),
    password: Yup.string().required(t('errors.requiredField')),
  })

  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [authFailed, setAuthFailed] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const sendAuthRequest = async (values, { setSubmitting, setErrors }) => {
    setAuthFailed(false)
    try {
      const res = await axios.post(routes.loginPath(), values)
      localStorage.setItem('userId', JSON.stringify(res.data))
      localStorage.setItem('user', values.username)
      dispatch(logIn())
      const { from } = location.state || { from: { pathname: '/' } }
      navigate(from)
    }
    catch (err) {
      setSubmitting(false)
      if (err.isAxiosError) {
        if (err.response?.status === 401) {
          toast.error(t('errors.userLoginError'))
          setErrors({
            password: t('errors.loginError'),
          })
          return
        }
        toast.error(t('errors.serverLoadDataError'))
        return
      }
      setAuthFailed(true)
      inputRef.current.select()
      toast.error(t('errors.networkError'))
    }
  }

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">{t('navbarTitle')}</a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <h1 className="text-center mb-4">{t('loginPage.loginTitle')}</h1>
                    <Formik
                      initialValues={{
                        username: '',
                        password: '',
                      }}
                      validationSchema={LoginSchema}
                      onSubmit={(values, { setSubmitting, setErrors }) => sendAuthRequest(values, { setSubmitting, setErrors })}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <BootstrapForm.Group className="mb-3" controlId="username">
                            <BootstrapForm.Label>{t('userName')}</BootstrapForm.Label>
                            <Field
                              as={BootstrapForm.Control}
                              type="text"
                              name="username"
                              isInvalid={authFailed}
                              ref={inputRef}
                              autoComplete="off"
                            />
                            {errors.username && touched.username && (
                              <div className="invalid-feedback">{errors.username}</div>
                            )}
                          </BootstrapForm.Group>
                          <BootstrapForm.Group className="mb-3" controlId="password">
                            <BootstrapForm.Label>{t('password')}</BootstrapForm.Label>
                            <Field
                              as={BootstrapForm.Control}
                              type="password"
                              name="password"
                              isInvalid={authFailed}
                              autoComplete="off"
                            />
                            {errors.password && touched.password && (
                              <div className="invalid-feedback">{errors.password}</div>
                            )}
                          </BootstrapForm.Group>
                          <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                            {t('loginPage.loginTitle')}
                          </Button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{t('loginPage.title')}</span>
                      <a href="/signup">{t('loginPage.signUpLink')}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default LoginPage
