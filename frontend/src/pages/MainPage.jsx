import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import routes from '../routes.js';
import { setChannels } from '../slices/channelsSlice.js';
import { setMessages, setMessage } from '../slices/messagesSlice.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};


const MainPage = ({ socket }) => {
  const [currentText, setCurrentText] = useState('');
  const dispatch = useDispatch();
  const channelContent = useSelector(state => state.channels.channels);
  const currentMessages = useSelector(state => state.messages.messages);

  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (newMessage) => {
      dispatch(setMessage(newMessage));
    };
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, dispatch]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [channelsRes, mes] = await Promise.all([
          axios.get(routes.channelsPath(), { headers: getAuthHeader() }),
          axios.get(routes.messagesPath(), { headers: getAuthHeader() })
        ]);
        dispatch(setChannels(channelsRes.data));
        dispatch(setMessages(mes.data));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchContent();
  }, [dispatch]);

  const handleInputChange = (e) => {
    setCurrentText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //if (!currentText.trim() || !currentUser) return;
    if (!currentText.trim()) return;

    try {
      await axios.post(
        routes.messagesPath(),
        { 
          body: currentText, 
          channelId: channelContent[0].id, 
          username: 'admin'
        },
        { headers: getAuthHeader() }
      );
      setCurrentText('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const renderChannels = () => {
    if (channelContent.length === 0) return null;
    
    return (
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channelContent.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            <button type="button" className="w-100 rounded-0 text-start btn btn-secondary">
              <span className="me-1">#</span>
              {channel.name}
            </button>
          </li>
        ))}
      </ul>
    );
  };

  const renderMessages = () => {
    if (currentMessages.length === 0) {
      return <div id="messages-box" className="chat-messages overflow-auto px-5"></div>;
    }
    
    return (
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {currentMessages.map((message) => (
          <div className="text-break mb-2" key={message.id}>
            <b>{message.username}</b>: {message.body}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-100">
      <div className="h-100" id="chat"> 
        <div className="d-flex flex-column h-100">
          <div className="container h-100 my-4 overflow-hidden rounded shadow">
            <div className="row h-100 bg-white flex-md-row"> 
              <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex"> 
                <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>Каналы</b>
                  <button type="button" className="p-0 text-primary btn btn-group-vertical"> 
                    +
                  </button>
                </div>
                {renderChannels()}
              </div>
              <div className="col p-0 h-100">
                <div className="d-flex flex-column h-100"> 
                  <div className="bg-light mb-4 p-3 shadow-sm small">
                    <p className="m-0">
                      <b>#current channel</b>
                    </p>
                    <span className="text-muted">{currentMessages.length} сообщений</span>
                  </div>
                  {renderMessages()}
                  <div className="mt-auto px-5 py-3">
                    <form noValidate className="py-1 border rounded-2" onSubmit={handleSubmit}>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>   
  );
};

export default MainPage;