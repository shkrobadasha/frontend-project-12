import axios from "axios";
import _ from 'lodash';
import { getAuthHeader } from "../../pages/MainPage";
import { setCurrentText } from "../../slices/messagesSlice";
import { useDispatch, useSelector } from "react-redux";
import routes from "../../routes";


const MessageForm = () => {
    const dispatch = useDispatch();
    const currentText = useSelector(state => state.messages.currentText);
    const currentChannel = useSelector(state => state.channels.currentChannel)

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
                console.error('Error sending message:', err);
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
                        placeholder="Введите сообщение..." 
                        className="border-0 p-0 ps-2 form-control"
                        value={currentText} 
                        onChange={handleInputChange}
                    />
                    <button type="submit" className="btn btn-group-vertical"> 
                        <span className="visually-hidden">Отправить</span>
                    </button>
                </div>
            </form>
        </div>
    )

};

export default MessageForm;