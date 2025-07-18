import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Form as BootstrapForm } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { logIn } from '../slices/authSlice.js'
import routes from '../routes'

const SignUpPage = () => {
  const { t } = useTranslation()

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, t('errors.nameLengthError'))
      .max(20, t('errors.nameLengthError'))
      .required(t('errors.requiredField')),
    password: Yup.string()
      .min(6, t('errors.passwordLengthError'))
      .required(t('errors.requiredField')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], t('errors.confirmPasswordError')),
  })

  const [authFailed, setAuthFailed] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  const sendSignUpRequest = async (values, { setSubmitting, setErrors }) => {
    const { username, password } = values
    setAuthFailed(false)
    try {
      const res = await axios.post(routes.signUpPath(), { username, password })
      localStorage.setItem('userId', JSON.stringify(res.data))
      localStorage.setItem('user', values.username)
      dispatch(logIn())
      navigate('/')
    }
    catch (err) {
      setSubmitting(false)
      if (err.isAxiosError) {
        if (err.response?.status === 409) {
          setErrors({
            confirmPassword: t('errors.alreadyExistsUserError'),
          })
          return
        }
        toast.error(t('errors.serverLoadDataError'))
        return
      }
      toast.error(t('errors.networkError'))
      setAuthFailed(true)
      inputRef.current.select()
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
                    <h1 className="text-center mb-4">{t('signUpPage.signUpTitle')}</h1>
                    <Formik
                      initialValues={{
                        username: '',
                        password: '',
                        confirmPassword: '',
                      }}
                      validationSchema={SignupSchema}
                      onSubmit={(values, { setSubmitting, setErrors }) => sendSignUpRequest(values, { setSubmitting, setErrors })}
                    >
                      {({ errors, touched }) => (
                        <Form>
                          <BootstrapForm.Group className="mb-3" controlId="username">
                            <BootstrapForm.Label>{t('signUpPage.userName')}</BootstrapForm.Label>
                            <Field
                              as={BootstrapForm.Control}
                              type="text"
                              name="username"
                              isInvalid={(touched.username && errors.username) || authFailed}
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
                              isInvalid={(touched.password && errors.password) || authFailed}
                              autoComplete="off"
                            />
                            {errors.password && touched.password && (
                              <div className="invalid-feedback">{errors.password}</div>
                            )}
                          </BootstrapForm.Group>
                          <BootstrapForm.Group className="mb-3" controlId="confirmPassword">
                            <BootstrapForm.Label>{t('signUpPage.confirmPassword')}</BootstrapForm.Label>
                            <Field
                              as={BootstrapForm.Control}
                              type="password"
                              name="confirmPassword"
                              isInvalid={(touched.confirmPassword && errors.confirmPassword) || authFailed}
                              autoComplete="off"
                            />
                            {errors.confirmPassword && touched.confirmPassword && (
                              <div className="invalid-feedback">{errors.confirmPassword}</div>
                            )}
                          </BootstrapForm.Group>
                          <Button type="submit" variant="outline-primary" className="w-100 mb-3">
                            {t('signUpPage.signUpButton')}
                          </Button>
                        </Form>
                      )}
                    </Formik>
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

export default SignUpPage
