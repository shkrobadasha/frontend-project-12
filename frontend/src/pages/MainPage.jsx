import { Link,Outlet } from 'react-router-dom';''
import React, { useEffect, useState } from 'react';
import routes from '../routes.js';
import axios from 'axios';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }
  return {};
};

//нам при попадании на страницу нужно будет делать сбор данных и сохранять их в слайс 

const MainPage  = () => {
    const [channelContent, setContent] = useState([]);
    useEffect(() => {
    const fetchContent = async () => {
      const channelsRes = await axios.get(routes.channelsPath(), {headers: getAuthHeader()});
      setContent(channelsRes.data)
      };
  
        fetchContent();
    }, []);

    const renderChannels = () => {
      if (channelContent.length === 0) {
        return null
      } else {
        return (
          <ul id="channels-box" class="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-bloc k">
            {channelContent.map((channel) => (
                <li class="nav-item w-100" key = {channel.id}>
                  <button type="button" class="w-100 rounded-0 text-start btn btn-secondary">
                    <span class="me-1">#</span>
                    {channel.name}
                  </button>
                </li>
              ))
            }
          </ul>
        )
      }
    }
    
    return(
          <div class="container h-100 my-4 overflow-hidden rounded shadow">
            <div class="row h-100 bg-white flex-md-row"> 
              <div class="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex"> 
                <div class="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                  <b>Каналы</b>
                  <button type="button" class="p-0 text-primary btn btn-group-vertical"> 
                    +
                  </button>
                </div>
                {renderChannels()}
              </div>
              <div class="d-flex flex-column h-100"> 
                <div class="bg-light mb-4 p-3 shadow-sm small">
                  <p class="m-0">
                    <b>#current channel</b>
                  </p>
                  <span class="text-muted">0 сообщений</ span>
                </div>
                <div id="messages-box" class="chat-messages overflow-auto px-5 "></div>
                <div class="mt-auto px-5 pу-3">
                  <form novalidate class="py-1 border rounded-2">
                    <div class="input-group has-validation"> 
                      <input name="body" ania-label="Новое сообщение" placeholder="Введите сообщение..." class="border-0 p-0 ps-2 form-control" value/>
                      <button type="submit" disabled class="btn btn-group-vertical"> 
                        <span class="visually-hidden">Отправить</ span>
                      </button>
                    </div>
                  </ form>
                </div>
              </div>
            </div>
          </div>
    )
};

export default MainPage;
