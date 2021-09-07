import { configureStore } from '@reduxjs/toolkit'
import playerSlice from './features/player/playerSlice'
import playlistsSlice from './features/playlists/playlistsSlice'
import userSlice from './features/user/userSlice'

export default configureStore({
  reducer: {
    playlists: playlistsSlice,
    user: userSlice,
    player: playerSlice,
  },
})
