import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    channels: [],
};

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        setChannels(state, {payload}) {
            state.channels = payload;
        },
        setChannel(state, {payload}) {
            const curChannels = state.channels;
            state.channels = [...curChannels, payload]
        }
    }
})

export const {setChannels, setChannel} = channelsSlice.actions;
export default channelsSlice.reducer
