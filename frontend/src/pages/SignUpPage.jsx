import axios from "axios";
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import React, { useState, useEffect, useRef} from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../slices/authSlice.js';
import routes from "../routes";


const SignupSchema = Yup.object().shape({
    username: Yup.string()
    .min(3, "От 3 до 20 символов")
    .max(20, "От 3 до 20 символов")
    .required('Обязательное поле'),
    password: Yup.string()
    .min(6, "Не менее 6 символов")
    .required('Обязательное поле'),
    confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли должны совпадать")
});

const SignUpPage = () => {
    const [authFailed, setAuthFailed] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const inputRef = useRef();
    const { t } = useTranslation();
    
    
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
         <div className="h-100">
            <div className="h-100" id="chat"> 
                <div className="d-flex flex-column h-100" >
                    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
                        <div className="container">
                            <a class="navbar-brand" href="/">{t("navbarTitle")}</a>
                        </div>
                    </nav>
                    <div className="container-fluid h-100">
                        <div className="row justify-content-center align-content-center h-100">
                            <div className="col-12 col-md-8 col-xxl-6">
                                <div className="card shadow-sm">
                                    <div className="card-body row p-5">
                                        <h1 className="text-center mb-4">{t("signUpPage.signUpTitle")}</h1>
                                        <Formik
                                            initialValues={{
                                                username: "",
                                                password: "",
                                                confirmPassword: "",
                                            }}
                                            validationSchema={SignupSchema}
                                            onSubmit={async (values, {setSubmitting, setErrors}) => {
                                               const {username, password} = values;
                                               setAuthFailed(false);
                                               try {
                                                    const res = await axios.post(routes.signUpPath(), {username, password})
                                                    localStorage.setItem('userId', JSON.stringify(res.data));
                                                    localStorage.setItem('user', values.username);
                                                    dispatch(logIn())
                                                    navigate("/");
                                                } catch (err) {
                                                    setSubmitting(false);
                                                    if (err.isAxiosError && err.response?.status === 409) {
                                                        setAuthFailed(true);
                                                        inputRef.current.select();
                                                        setErrors({
                                                            confirmPassword: 'Такой пользователь уже существует',
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
                                                        <BootstrapForm.Label>{t("userName")}</BootstrapForm.Label>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="text"
                                                            name="username"
                                                             isInvalid={touched.username && errors.username || authFailed} 
                                                            ref={inputRef}
                                                        />
                                                        {errors.username && touched.username ? (
                                                                <div className="invalid-feedback">{errors.username}</div>
                                                            ): null}
                                                    </BootstrapForm.Group>
                                                    <BootstrapForm.Group className="mb-3" controlId="password">
                                                        <BootstrapForm.Label>{t("password")}</BootstrapForm.Label>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="password"
                                                            name="password"
                                                            isInvalid={touched.password && errors.password || authFailed}
                                                        />
                                                        {errors.password && touched.password ? (
                                                            <div className="invalid-feedback">{errors.password}</div>
                                                            ): null}
                                                    </BootstrapForm.Group>
                                                    <BootstrapForm.Group className="mb-3" controlId="confirmPassword">
                                                        <BootstrapForm.Label>{t("signUpPage.confirmPassword")}</BootstrapForm.Label>
                                                        <Field
                                                            as={BootstrapForm.Control}
                                                            type="password"
                                                            name="confirmPassword"
                                                            isInvalid={touched.confirmPassword && errors.confirmPassword || authFailed}
                                                        />
                                                        {errors.confirmPassword && touched.confirmPassword ? (
                                                                <div className="invalid-feedback">{errors.confirmPassword}</div>
                                                            ): null}
                                                    </BootstrapForm.Group>
                                                    <Button type='submit' variant="outline-primary" className="w-100 mb-3 btn btn-outline-primary">{t("signUpPage.signUpButton")}</Button>
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
        </div>
    );
};

export default SignUpPage;