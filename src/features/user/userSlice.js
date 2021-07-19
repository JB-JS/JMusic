import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: (localStorage.getItem('user') &&
    JSON.parse(localStorage.getItem('user'))) || {
    auth: null,
    displayName: null,
    photoURL: null,
    access_token: null,
    isLoggedIn: false,
  },
  reducers: {
    signin: (state, action) => {
      localStorage.setItem('user', JSON.stringify({ ...action.payload }))

      return {
        ...action.payload,
      }
    },

    signOut: (state) => {
      state.auth()

      return {
        auth: null,
        displayName: null,
        photoURL: null,
        access_token: null,
        isLoggedIn: false,
      }
    },
  },
})

export const { signin, signOut } = userSlice.actions

export default userSlice.reducer
