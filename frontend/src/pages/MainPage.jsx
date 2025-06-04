import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import routes from '../routes.js';
import { setChannels, setChannel, deleteChannel, renameChannel} from '../slices/channelsSlice.js';
import { setMessages, setMessage } from '../slices/messagesSlice.js';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import AddModalWindow from '../components/modalWindows/AddModalWindow.jsx';
import RemoveModalWindow from '../components/modalWindows/RemoveModalWindow.jsx';
import EditModalWindow from '../components/modalWindows/EditModalWindow.jsx';



export const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));
  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

const defaultChannel = { id: '1', name: 'general', removable: false }

const MainPage = ({ socket }) => {

  const [currentText, setCurrentText] = useState('');
  const [currentChannel, setCurrentChannel] = useState(defaultChannel);
  const [modalActive, setModalActive] = useState(false);
  const [removeModalActive, setRemoveModalActive] = useState(false);
  const [idForDelete, setIdForDelete] = useState(0);
  const [editModalActive, setEditModalActive] = useState(false);
  const [channelForEdit, setChannelForEdit] = useState('');

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
      setCurrentChannel(newChannel)
    });

    socket.on('removeChannel', (deletedChannelId) => {
      dispatch(deleteChannel(deletedChannelId))
      setCurrentChannel(defaultChannel)
    });

    socket.on('renameChannel', (renamedChannel) => {
      dispatch(renameChannel(renamedChannel))
      setCurrentChannel(renamedChannel)
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

  const handleDeleteChannelClick = (id) => {
    setRemoveModalActive(true);
    setIdForDelete(id)
  };

  const handleEditChannelClick = (channel) => {
    setEditModalActive(true);
    setChannelForEdit(channel)
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

              <Dropdown as={ButtonGroup} className= "d-flex" onClick = {() => clickChannelHandler(channel.id)}>
             
                  <Button 
                      variant= {(currentChannel.id === channel.id) ? "secondary" : "light"} 
                      className={cn('w-100', 'rounded-0', 'text-start', 'btn',
                   {'btn-secondary': (currentChannel.id === channel.id)})}>
                      <span className="me-1">#</span>
                      {channel.name}
                    </Button>


                  <Dropdown.Toggle 
                      split 
                      variant= {(currentChannel.id === channel.id) ? "secondary" : "light"} 
                      id="dropdown-channel-control" 
                      className="flex-grow-0"
                  >
                      <span className="visually-hidden">Управление каналом</span>
                  </Dropdown.Toggle>

                  
                  <Dropdown.Menu 
                      className="dropdown-menu" 
                      style={{ 
                        position: 'absolute', 
                        inset: '0px auto auto 0px', 
                        transform: 'translate(0px, 40px)'
                      }}
                    >
                      <Dropdown.Item href="#" className="dropdown-item" onClick={() => handleDeleteChannelClick(channel.id)}>Удалить</Dropdown.Item>
                      <Dropdown.Item href="#" className="dropdown-item" onClick={() => handleEditChannelClick(channel)}>Переименовать</Dropdown.Item>
                  </Dropdown.Menu>
              </Dropdown>
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
      <AddModalWindow active = {modalActive} setActive ={setModalActive}/>
      <RemoveModalWindow active = {removeModalActive} setActive ={setRemoveModalActive} idForDel={idForDelete}/>
      <EditModalWindow active = {editModalActive} setActive ={setEditModalActive} channelForEd={channelForEdit}/>
    </div> 
  );
};


export default MainPage;