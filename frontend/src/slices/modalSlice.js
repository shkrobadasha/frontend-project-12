import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isAddModalActive: false,
    isEditModalActive: false,
    isRemoveModalActive: false,
    idForRemove: 0,
    channelForEdit: {},
};

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        setAddModalActive(state, {payload}) {
            state.isAddModalActive = payload
        },
        setEditModalActive(state, {payload}) {
            state.isEditModalActive = payload
        },
        setRemoveModalActive(state, {payload}) {
            state.isRemoveModalActive = payload
        },
        setIdForRemove(state, {payload}) {
            state.idForRemove = payload
        },
        setChannelForEdit(state, {payload}) {
            state.channelForEdit = payload
        },

    }
});

export const {setAddModalActive, setEditModalActive, setRemoveModalActive, setIdForRemove, setChannelForEdit} = modalSlice.actions;
export default modalSlice.reducer;