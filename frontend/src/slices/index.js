import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice.js'
import messagesReducer from './messagesSlice.js'
import channelsReducer from './channelsSlice.js'

export default configureStore({
    reducer: {
        auth: authReducer,
        channels: channelsReducer,
        messages: messagesReducer,
    }
});

