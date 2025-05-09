import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
    firstName: Yup.string()
    .required('Обязательное поле'),
    password: Yup.string()
    .required('Обязательное поле'),

});

const LoginPage = () => {

    return (
        <div>
            <h1>Registration</h1>
            <Formik
                initialValues = {{
                    firstName: '',
                    password: '',
                }}
                validationSchema = {SignupSchema}
                onSubmit ={ (values) => { console.log(values)}}
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