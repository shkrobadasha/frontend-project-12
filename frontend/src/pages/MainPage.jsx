import { Link,Outlet } from 'react-router-dom';''
import React, { useEffect, useState } from 'react';
import routes from '../routes.js';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChannels } from '../slices/channelsSlice.js';
import { getSocket, disconnectSocket } from '../socket.js';
import { setMessages, setMessage } from '../slices/messagesSlice.js';


const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

//можно использовать сокеты только для получения событий (то есть типа пользователь кликнул что-то удалить и у нас откинулось событие)
// то есть сокеты у нас как бы шлют уведомленмия от сервера

//клиент инициирует событие кликом и тд, сервер реагирует и посылает от сервера что вот это-то хотят сделать
//то есть сервер на событие клиента будет реагировать событием и отправлять это клиенту 


//нам сейчас нужно реализовать отправку сообщений, и их получение по дефолту
const MainPage  = () => {

  const [currentText, setCurrentText] = useState('')
  const dispatch = useDispatch();
  const socket = getSocket();

  useEffect(() => {
    socket.on('newMessage', (newMessage) => {
      dispatch(setMessage(newMessage))
      console.log('just get new message!')
    })
  }, [socket])



  useEffect(() => {
    const fetchContent = async () => {
      const channelsRes = await axios.get(routes.channelsPath(), {headers: getAuthHeader()});
      dispatch(setChannels(channelsRes.data))
      const mes = await axios.get(routes.messagesPath(), {headers: getAuthHeader()})
      dispatch(setMessages(mes.data))
      };
  
        fetchContent();
  }, []);

  //тут будет useEffect c aetchem

  

    const channelContent = useSelector(state => state.channels.channels);
    //это будет перерендериваться, когда стейт поменяется
    const currentMessages = useSelector(state => state.messages.messages);

    const currentUser = channelContent[0]

    const handleInputChange = (e) => {
      setCurrentText(e.target.value)
    };


    const handleClick = (e) => {
      e.preventDefault();
      if (currentText.trim !== '') {
        const newMessage = { body: `${currentText}`, channelId: `${currentUser.id}`, username: `${currentUser.name}`}
        try { 
          axios.post(routes.messagesPath, newMessage, {headers: getAuthHeader()})
        } catch (err) {
          console.log(err)
        }
        setCurrentText('')
      }
    }

    const renderChannels = () => {
      if (channelContent.length === 0) {
        return null
      } else {
        return (
          <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
            {channelContent.map((channel) => (
                <li className="nav-item w-100" key = {channel.id}>
                  <button type="button" className="w-100 rounded-0 text-start btn btn-secondary">
                    <span className="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              ))
            }
          </ul>
        )
      }
    }

    const renderMessages = () => {
      if (currentMessages.length === 0) {
        return null
      } else {
        <div id="messages-box" className="chat-messages overflow-auto px-5 ">
          {currentMessages.map((message) => (
            <div class="text-break mb-2" key = {message.id}>
              <b>{message.username}</b>
              {message.body}
            </div>
          ))}

        </div>
      }
    }
    
    return(
      <div className="h-100">
        <div className="h-100" id="chat"> 
          <div className="d-flex flex-column h-100" >
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
                <div class="col p-0 h-100">
                  <div className="d-flex flex-column h-100"> 
                    <div className="bg-light mb-4 p-3 shadow-sm small">
                      <p className="m-0">
                        <b>#current channel</b>
                      </p>
                      <span className="text-muted">0 сообщений</ span>
                    </div>
                    {renderMessages()}
                    <div className="mt-auto px-5 pу-3">
                      <form novalidate className="py-1 border rounded-2" onClick={handleClick}>
                        <div className="input-group has-validation"> 
                          <input name="body" ania-label="Новое сообщение" placeholder="Введите сообщение..." className="border-0 p-0 ps-2 form-control"
                           value = {currentText} onChange={handleInputChange}/>
                          <button type="submit" disabled className="btn btn-group-vertical" > 
                            <span className="visually-hidden">Отправить</ span>
                          </button>
                        </div>
                      </ form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>   
    )
};

export default MainPage;
