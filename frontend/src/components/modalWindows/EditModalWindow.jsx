import React, { useState, useEffect, useRef} from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import _ from 'lodash';
import { Button, Form as BootstrapForm } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from "react-redux";
import { getAuthHeader } from "../../pages/MainPage.jsx";
import routes from "../../routes.js";
import { setEditModalActive } from '../../slices/modalSlice.js';
import { setCurrentChannel } from '../../slices/channelsSlice.js';

const EditModalWindow = () => {
    // eslint-disable-next-line no-unused-vars
    const [authFailed, setAuthFailed] = useState(false);
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const isActive = useSelector(state => state.modal.isEditModalActive);
    const channelForEdit = useSelector(state => state.modal.channelForEdit);
    const currentChannels = useSelector(state => state.channels.channels);
    const channelNames = currentChannels.map(channel => channel.name);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isActive && inputRef.current){
            inputRef.current.focus();
        }
    }, [isActive]);
//надо ли оно тут
     useEffect(() => {
            if (currentChannels && isActive){
                dispatch(setCurrentChannel(currentChannels[currentChannels.length - 1]))
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [currentChannels]);

    const channelScheme = Yup.object().shape({
        channelName: Yup.string()
            .min(3, t("errors.nameLengthError"))
            .max(20, t("errors.nameLengthError"))
            .notOneOf(channelNames, t('errors.alreadyExistsChannelError'))
            .required(t('errors.requiredField'))
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
                            <div className="modal-title h4">{t("modalWindow.windowsTitles.editTitle")}</div>
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
                                        //dispatch(setCurrentChannel(newChannel))
                                    } catch(err) {
                                        if (err.isAxiosError ) {
                                            toast.error(t("errors.serverLoadDataError"))
                                        } else {
                                            toast.error(t("errors.networkError"))
                                        }                                       
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
                                                id="name"
                                                name="channelName"
                                                isInvalid={!!errors.channelName && touched.channelName}
                                                ref={inputRef}
                                            />
                                            {errors.channelName && touched.channelName && (
                                                <div className="invalid-feedback">{errors.channelName}</div>
                                            )}
                                            <label className="visually-hidden" htmlFor="name">{t("modalWindow.windowsTitles.channelName")}</label>
                                        </BootstrapForm.Group>
                                        <div className="d-flex justify-content-end">
                                            <Button 
                                                type="button" 
                                                className="me-2 btn btn-secondary"
                                                onClick={() => dispatch(setEditModalActive(false))}
                                            >
                                                {t("modalWindow.windowsButtons.cancelButton")}
                                            </Button>
                                            <Button 
                                                type="submit" 
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                {t("modalWindow.windowsButtons.sendButton")}
                                            </Button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer/>
        </>
        );
    }

    
};

export default EditModalWindow;