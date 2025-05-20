import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import React, { useState } from 'react';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../slices/authSlice.js';
import routes from '../routes.js';

const SignupSchema = Yup.object().shape({
    username: Yup.string().required('Обязательное поле'),
    password: Yup.string().required('Обязательное поле'),
});

const LoginPage = () => {
    const location = useLocation();
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [authFailed, setAuthFailed] = useState(false);

    return (
        <div>
            <h1>Login</h1>
            <Formik
                initialValues={{
                    username: '',
                    password: '',
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    setAuthFailed(false)
                    try {
                        const res = await axios.post(routes.loginPath(), values);
                        localStorage.setItem('userId', JSON.stringify(res.data));
                        dispatch(logIn())

                        const { from } = location.state || { from: { pathname: '/' } };
                        navigate(from);
                    } catch (err) {
                        setSubmitting(false);
                        if (err.isAxiosError && err.response?.status === 401) {
                            setAuthFailed(true);
                            setErrors({
                                password: 'Неверный логин или пароль',
                            });
                            return;
                        }
                        throw err;
                    }
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <BootstrapForm.Group className="mb-3" controlId="username">
                            <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>
                            <Field
                                as={BootstrapForm.Control}
                                type="text"
                                name="username"
                                isInvalid={authFailed}
                            />
                            {errors.username && touched.username ? (
                                    <div>{errors.username}</div>
                                ): null}
                        </BootstrapForm.Group>

                        <BootstrapForm.Group className="mb-3" controlId="password">
                            <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                            <Field
                                as={BootstrapForm.Control}
                                type="password"
                                name="password"
                                isInvalid={authFailed}
                            />
                            {errors.password && touched.password ? (
                                    <div>{errors.password}</div>
                                ): null}
                        </BootstrapForm.Group>

                        <Button type='submit' variant="outline-primary">Submit</Button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default LoginPage;