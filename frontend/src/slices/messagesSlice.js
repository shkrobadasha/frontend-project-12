import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  currentText: '',
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages(state, { payload }) {
      state.messages = payload
    },
    setMessage(state, { payload }) {
      const curMessages = state.messages
      state.messages = [...curMessages, payload]
    },
    setCurrentText(state, { payload }) {
      state.currentText = payload
    },
  },
})

export const { setMessages, setMessage, setCurrentText } = messagesSlice.actions
export default messagesSlice.reducer
