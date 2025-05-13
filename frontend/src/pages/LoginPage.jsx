import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';


import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
    .required('Обязательное поле'),
    password: Yup.string()
    .required('Обязательное поле'),

});

const LoginPage = () => {
    const auth = useAuth();
    const [authFailed, setAuthFailed] = useState(false);
    const inputRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        inputRef.current.focus()
    }, [])

    return (
        <div>
            <h1>Registration</h1>
            <Formik
                initialValues = {{
                    firstName: '',
                    password: '',
                }}
                validationSchema = {SignupSchema}
                onSubmit ={ 

                    //здесь будет происходить обработка запроса
                    (values) => { console.log(values)}
                }
            >
                {({errors, touched}) => (
                    <Form>
                        <Field name = 'firstName' />
                        {errors.firstName && touched.firstName ? (
                            <div>{errors.firstName}</div>
                        ): null}
                        <Field name = 'password' />
                        {errors.password && touched.password ? (
                            <div>{errors.password}</div>
                        ): null}
                        <button type='submit'>Submit</button>
                    </Form>
                )
                }
            </Formik>
        </div>
    )
};

export default LoginPage; 