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
    }
})

export const {setChannels} = channelsSlice.actions;
export default channelsSlice.reducer
