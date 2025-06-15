import axios from "axios";
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import { getAuthHeader } from "../../pages/MainPage";
import { setCurrentText } from "../../slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import routes from "../../routes";


const MessageForm = () => {
    const dispatch = useDispatch();
    const currentText = useSelector(state => state.messages.currentText);
    const currentChannel = useSelector(state => state.channels.currentChannel)
    const { t } = useTranslation();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!currentText.trim()) return;
            try {
                await axios.post(
                    routes.messagesPath(),
                    { 
                    id: _.uniqueId(),
                    body: currentText, 
                    channelId: currentChannel.id, 
                    username: `${localStorage.getItem('user')}`
                    },
                    { headers: getAuthHeader() }
                );
                dispatch(setCurrentText(''));
            } catch (err) {
                if (err.isAxiosError) {
                    toast.err(t("errors.serverLoadDataError"))
                }
                toast.err(t("errors.networkError"))                                               
        }
    };


    const handleInputChange = (e) => {
        dispatch(setCurrentText(e.target.value));
    };
    return (
        <div className="mt-auto px-5 py-3">
            <form noValidate className="py-1 border rounded-2" onSubmit={handleSendMessage}>
                <div className="input-group has-validation"> 
                    <input 
                        name="body" 
                        aria-label="Новое сообщение"
                        placeholder={t("mainPage.messagesDefaultText")}
                        className="border-0 p-0 ps-2 form-control"
                        value={currentText} 
                        onChange={handleInputChange}
                    />
                    <button type="submit" className="btn btn-primary"> 
                         {t("modalWindow.windowsButtons.sendButton")}
                    </button>
                </div>
            </form>
            <ToastContainer/>
        </div>
    )

};

export default MessageForm;