import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    messages: [],
};

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages(state, {payload}){
            state.messages = payload
        },
        setMessage(state, {payload}) {
            const curMessages = state.messages;
            state.messages = [...curMessages, payload]
        }
    }
});

export const {setMessages, setMessage} = messagesSlice.actions;
export default messagesSlice.reducer