import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn: (state) => {
      state.loggedIn = true
    },
    logOut: (state) => {
      localStorage.removeItem('userId')
      state.loggedIn = false
    },

  },
})

export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer