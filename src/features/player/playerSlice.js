import { createSlice } from '@reduxjs/toolkit'

export const playerSlice = createSlice({
  name: 'player',

  initialState: {
    video: {
      show: false,
      title: '',
      publishedAt: null,
      thumbnail: null,
      channelTitle: null,
      iframe: null,
      loading: true,
      playerState: null,
      start: '0:00',
      end: '0:00',
      progress: 0,
      sound: {
        volume: null,
        isVolumeDragging: false,
      },
      isPaused: null,
      isMuted: null,
      isVideoDragging: false,
      isShuffle: false,
      isLoop: false,
    },
    hover: {
      isHover: false,
      hoverLeft: 0,
      hoverTime: 0,
    },
  },

  reducers: {
    changeVideo(state, action) {
      return {
        ...state,
        video: {
          ...state.video,
          ...action.payload,
          sound: {
            ...state.video.sound,
            ...action.payload.sound,
          },
        },
        ...(action.progressTimer
          ? { progressTimer: action.progressTimer }
          : {}),
      }
    },

    changeHover(state, action) {
      return {
        ...state,
        hover: {
          ...state.hover,
          ...action.payload,
        },
      }
    },
  },
})

export const { changeVideo, changeHover } = playerSlice.actions

export default playerSlice.reducer
