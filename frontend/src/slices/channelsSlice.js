import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  channels: [],
  currentChannel: { id: '1', name: 'general', removable: false },
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels(state, { payload }) {
      state.channels = payload
    },
    setChannel(state, { payload }) {
      const curChannels = state.channels
      state.channels = [...curChannels, payload]
    },
    deleteChannel(state, { payload: { id } }) {
      const curChannels = state.channels
      const newChannels = curChannels.filter(channel => channel.id !== id)
      state.channels = newChannels
    },
    renameChannel(state, { payload }) {
      state.channels = state.channels.map(channel =>
        channel.id === payload.id ? payload : channel,
      )
    },
    setCurrentChannel(state, { payload }) {
      state.currentChannel = payload
    },
  },
})

export const {
  setChannels,
  setChannel,
  deleteChannel,
  renameChannel,
  setCurrentChannel,
} = channelsSlice.actions
export default channelsSlice.reducer
