import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './slices/index.js'
import './styles.css';
import i18next from './18n.js'
import { io } from 'socket.io-client';

export const socket = io();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>
        <App socket = {socket}/>
    </Provider>
  </StrictMode>,
)
