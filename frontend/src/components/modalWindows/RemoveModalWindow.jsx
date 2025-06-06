import React, { useState} from 'react';
import axios from "axios";
import _ from 'lodash';
import { useDispatch,useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { getAuthHeader } from "../../pages/MainPage.jsx";
import routes from "../../routes.js";
import { setRemoveModalActive } from '../../slices/modalSlice.js';

const RemoveModalWindow = () => {
    const [authFailed, setAuthFailed] = useState(false);    

    const dispatch = useDispatch();
    const isActive = useSelector(state => state.modal.isRemoveModalActive);
    const idForRemove = useSelector(state => state.modal.idForRemove);

    const deleteHandler = async () => {
        setAuthFailed(false);
        try {
            await axios.delete(routes.channelPath(idForRemove), {headers: getAuthHeader()});
            dispatch(setRemoveModalActive(false))
        } catch {
            setAuthFailed(true);
        }
    }

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
                            <div className="modal-title h4">Удалить канал</div>
                            <button 
                                type="button" 
                                className="btn btn-close" 
                                onClick={() => dispatch(setRemoveModalActive(false))}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p class="lead"> Уверены? </p>
                            <div className="d-flex justify-content-end">
                                <Button 
                                    type="button" 
                                    className="me-2 btn btn-secondary"
                                    onClick={() => dispatch(setRemoveModalActive(false))}
                                >
                                    Отменить
                                </Button>
                                <Button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick ={() => deleteHandler()}
                                >
                                    Удалить
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        );
    }

    
};

export default RemoveModalWindow;