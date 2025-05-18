import { Formik, Form, Field} from 'formik';
import * as Yup from 'yup';

import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/index.jsx';
import routes from '../routes.js';

const SignupSchema = Yup.object().shape({
    username: Yup.string()
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

    /*useEffect(() => {
        inputRef.current.focus()
    }, [])*/

    return (
        <div>
            <h1>Registration</h1>
            <Formik
                initialValues = {{
                    username: '',
                    password: '',
                }}
                validationSchema = {SignupSchema}
                onSubmit = { async (values, { setSubmitting }) => { 
                    setAuthFailed(false);
                        try {
                            const res = await axios.post(routes.loginPath(), values);
                            localStorage.setItem('userId', JSON.stringify(res.data));
                            auth.logIn();
                            const {from} = location.state || { from: { pathname: '/' } };
                            navigate(from);
                        }catch (err){
                            setSubmitting(false);
                            if (err.isAxiosError && err.response.status === 401) {
                                setAuthFailed(true);
                                return;
                            }
                            throw err
                        }
                    }
                }
            >
                {({errors, touched }) => (
                    <Form>

                                <BootstrapForm.Label>Имя пользователя</BootstrapForm.Label>  
                                <Field name = 'username' />
                                {errors.username && touched.username ? (
                                    <div>{errors.username}</div>
                                ): null}


                                <BootstrapForm.Label>Пароль</BootstrapForm.Label>
                                 <Field name = 'password' />
                                {errors.password && touched.password ? (
                                    <div>{errors.password}</div>
                                ): null}
        
                            <Button type='submit' variant="outline-primary">Submit</Button>
                    </Form>
                )
                }
            </Formik>
        </div>
    )
};

export default LoginPage; 