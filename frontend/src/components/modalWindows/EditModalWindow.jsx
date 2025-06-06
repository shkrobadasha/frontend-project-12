import React, { useState, useEffect, useRef} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import _ from 'lodash';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { getAuthHeader } from "../../pages/MainPage.jsx";
import routes from "../../routes.js";
import { setEditModalActive } from '../../slices/modalSlice.js';

//нужно переиспользовать наше окно

const EditModalWindow = () => {
    const [authFailed, setAuthFailed] = useState(false);
    const dispatch = useDispatch();
    const isActive = useSelector(state => state.modal.isEditModalActive);
    const channelForEdit = useSelector(state => state.modal.channelForEdit);
    const currentChannels = useSelector(state => state.channels.channels);
    const channelNames = currentChannels.map(channel => channel.name);
    const inputRef = useRef();

    useEffect(() => {
        if (isActive && inputRef.current){
            inputRef.current.focus();
        }
    }, [isActive]);

    const channelScheme = Yup.object().shape({
        channelName: Yup.string()
            .min(3, 'От 3 до 20 символов')
            .max(20, 'От 3 до 20 символов')
            .notOneOf(channelNames, 'Должно быть уникальным')
            .required('Обязательное поле')
    });

    if (!isActive) {
        return null
    } else {
        return (
            <>
            <div className="modal-backdrop fade show"></div>
            <div className={`fade modal ${isActive ? 'show' : ''}`} 
                style={{ display: isActive ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h4">Переименовать канал</div>
                            <button 
                                type="button" 
                                className="btn btn-close" 
                                onClick={() => dispatch(setEditModalActive(false))}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <Formik
                                initialValues={{ channelName: channelForEdit.name }}
                                validationSchema={channelScheme}
                                onSubmit={async (values, { setSubmitting }) => {
                                    setAuthFailed(false);
                                    try {
                                        const newChannelName = {
                                            name: values.channelName,
                                        };
                                        await axios.patch(routes.channelPath(channelForEdit.id), newChannelName, { 
                                            headers: getAuthHeader() 
                                        });
                                        setSubmitting(false);
                                        dispatch(setEditModalActive(false));
                                    } catch(err) {
                                        setSubmitting(false);
                                        setAuthFailed(true);
                                    }
                                    
                                }}
                            >
                                {({ errors, touched, isSubmitting }) => (
                                    <Form >
                                        <BootstrapForm.Group className="mb-3">
                                            <BootstrapForm.Label>Имя канала</BootstrapForm.Label>
                                            <Field
                                                as={BootstrapForm.Control}
                                                type="text"
                                                name="channelName"
                                                isInvalid={!!errors.channelName && touched.channelName}
                                                ref={inputRef}
                                            />
                                            {errors.channelName && touched.channelName && (
                                                <div className="invalid-feedback">{errors.channelName}</div>
                                            )}
                                        </BootstrapForm.Group>
                                        <div className="d-flex justify-content-end">
                                            <Button 
                                                type="button" 
                                                className="me-2 btn btn-secondary"
                                                onClick={() => dispatch(setEditModalActive(false))}
                                            >
                                                Отменить
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                Отправить
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }

    
};

export default EditModalWindow;