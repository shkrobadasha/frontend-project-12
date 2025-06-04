import React, { useState} from 'react';
import axios from "axios";
import _ from 'lodash';
import { Button } from 'react-bootstrap';
import { getAuthHeader } from "../../pages/MainPage.jsx";
import routes from "../../routes.js";

//нужно переиспользовать наше окно

const RemoveModalWindow = ({ active, setActive, idForDel }) => {
    const [authFailed, setAuthFailed] = useState(false);    

    const deleteHandler = async () => {
        setAuthFailed(false);
        try {
            await axios.delete(routes.channelPath(idForDel), {headers: getAuthHeader()});
            setActive(false)
        } catch {
            setAuthFailed(true);
        }
    }

    if (!active) {
        return null
    } else {
        return (
            <>
            <div className="modal-backdrop fade show"></div>
            <div className={`fade modal ${active ? 'show' : ''}`} 
                style={{ display: active ? 'block' : 'none' }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-title h4">Удалить канал</div>
                            <button 
                                type="button" 
                                className="btn btn-close" 
                                onClick={() => setActive(false)}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p class="lead"> Уверены? </p>
                            <div className="d-flex justify-content-end">
                                <Button 
                                    type="button" 
                                    className="me-2 btn btn-secondary"
                                    onClick={() => setActive(false)}
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