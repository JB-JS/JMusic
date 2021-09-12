import { createSlice } from '@reduxjs/toolkit'

export const playlistsSlice = createSlice({
  name: 'playlists',
  initialState: {
    isLoading: false,
    playlists: [],
    error: null,
  },
  reducers: {
    loading(state) {
      return { ...state, isLoading: true }
    },
    success(state, action) {
      console.log(action.payload)
      return { ...state, isLoading: false, playlists: action.payload }
    },
    error(state, action) {
      return { ...state, isLoading: false, error: action.payload }
    },
    update(state, action) {
      return {
        ...state,
        playlists: state.playlists.map((playlist) =>
          playlist.id === action.payload.id
            ? { ...playlist, ...action.payload.data }
            : playlist
        ),
      }
    },
  },
})

export const { loading, success, error, update } = playlistsSlice.actions

export default playlistsSlice.reducer
