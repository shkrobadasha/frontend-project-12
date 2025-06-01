import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import routes from '../routes.js';
import { setChannels, setChannel } from '../slices/channelsSlice.js';
import { setMessages, setMessage } from '../slices/messagesSlice.js';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import Modal from '../components/ModalWindow.jsx';


export const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};


const MainPage = ({ socket }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentChannel, setCurrentChannel] = useState({ id: '1', name: 'general', removable: false });
  const [modalActive, setModalActive] = useState(false);
  const [changedChannelId, setChangedChannelId] = useState(0);
  //const [isVisible, setVisible] = useState(false)

  //можно сделать слайс каналов чтобы там хранить активный канал

  //нужно сделать что когда мы создаем канал нас туда перемещает

  

  const dispatch = useDispatch();
  const channelContent = useSelector(state => state.channels.channels);
  const currentMessages = useSelector(state => state.messages.messages);
  const navigate = useNavigate();

  const getMessagesOfCurrentChannel = (messages) => {
    const currentMessages = messages.filter((message) => message.channelId === currentChannel.id);
    return currentMessages
  }

  useEffect(() => {
    if (!socket) return;
    
    socket.on('newMessage', (newMessage) => {
      dispatch(setMessage(newMessage));
    });

    socket.on('newChannel', (newChannel) => {
      dispatch(setChannel(newChannel))

      //посмотреть, почему-то не переключается нормально, выходит пустой канал
      setCurrentChannel(newChannel)
    })

    return () => {
      socket.off('newMessage', );
      socket.off('newChannel');
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

  const clickChannelHandler = (currentId) => {
    const channel = channelContent.find(item => item.id === currentId);
    setCurrentChannel(channel)
  }

  const handleInputChange = (e) => {
    setCurrentText(e.target.value);
  };

  const handleLeave = () => {
    navigate('/login');
    localStorage.removeItem('userId');
  }

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
      setCurrentText('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };


  
  const renderChannels = () => {
    if (channelContent.length === 0){
      return <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"></ul>
    } 
    return (
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channelContent.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            {(channel.removable === true) ? 
              <div role="group" className={cn("d-flex", "dropdown", "btn-group",
               {'show': channel.id === changedChannelId})} onClick = {() => clickChannelHandler(channel.id)}>
                <button type="button" className={cn('w-100', 'rounded-0', 'text-start', 'btn', {'btn-secondary': (currentChannel.id === channel.id)})}>
                  <span className="me-1">#</span>
                  {channel.name}
                </button>
                <button type = "button" id="react-aria276996935-:r0:" aria-expanded={channel.id === changedChannelId}
                 className={cn("flex-grow-0", "dropdown-toggle", "dropdown-toggle-split", "btn",{'btn-secondary': (currentChannel.id === channel.id)}, {'show': channel.id === changedChannelId})} 
                 onClick={()=> setChangedChannelId(channel.id)}>
                  <span className="visually-hidden">
                    Управление каналом
                  </span>
                </button>
                <div x-placement="bottom-end" aria-labelledby="react-aria276996935-:r0:" className={cn("dropdown-menu", {'show': channel.id === changedChannelId})}
                  data-popper-reference-hidden="false" data-popper-escaped="false" data-popper-placement="bottom-end" 
                  style={{
                    position: 'absolute',
                    inset: '0px 0px auto auto',
                    transform: 'translate3d(0px, 40px, 0px)'
                  }}>
                  <a data-rr-ui-dropdown-item class="dropdown-item" role="button" tabindex="0" href="#">Удалить</a>
                  <a data-rr-ui-dropdown-item class="dropdown-item" role="button" tabindex="0" href="#">Переименовать</a>
                </div>
              </div>
              : <button type="button" className={cn('w-100', 'rounded-0', 'text-start', 'btn', {'btn-secondary': (currentChannel.id === channel.id)})} onClick = {() => clickChannelHandler(channel.id)}>
                  <span className="me-1">#</span>
                  {channel.name}
                </button>}
          </li>
        ))}
      </ul>
    );
  };

  const renderMessages = () => {
    const curMessages = getMessagesOfCurrentChannel(currentMessages)
    if (curMessages.length === 0) {
      return <div id="messages-box" className="chat-messages overflow-auto px-5"></div>;
    }
    
    return (
      <div id="messages-box" className="chat-messages overflow-auto px-5">
        {curMessages.map((message) => (
          <div className="text-break mb-2" key={message.id}>
            <b>{message.username}</b>: {message.body}
          </div>
        ))}
      </div>
    );
  };



  return (
    <div className="vh-100"> 
      <div className="h-100">
        <div className="h-100" id="chat"> 
          <div className="vh-100 d-flex flex-column h-100">
            <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white" >
              <div class="container">
                <a class="navbar-brand" href="/">My Chat</a>
                <button type='button' class="btn btn-primary" onClick={handleLeave}>Выйти</button>
              </div>
            </nav>
            <div className="flex-grow-1 container h-100 my-4 overflow-hidden rounded shadow">
              <div className="row h-100 bg-white flex-md-row"> 
                <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex"> 
                  <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                    <b>Каналы</b>
                    <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={() => setModalActive(true)}> 
                      +
                    </button>
                  </div>
                  {renderChannels()}
                </div>
                <div className="col p-0 h-100">
                  <div className="d-flex flex-column h-100"> 
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b># {currentChannel.name}</b>
                      </p>
                      <span className="text-muted">{getMessagesOfCurrentChannel(currentMessages).length} сообщений</span>
                    </div>
                    {renderMessages()}
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal active = {modalActive} setActive ={setModalActive}/>
    </div> 
  );
};

export default MainPage;