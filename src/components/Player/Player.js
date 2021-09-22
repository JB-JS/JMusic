import React, { useCallback, useEffect, useReducer, useRef } from 'react'
import { toHMS } from '../../lib/utils'
import Playerbar from '../Playerbar'
import { ytApi } from '../../lib/api/api'
import volumeStorage from '../../lib/storage/volumeStorage'
import YtVideo from '../YtVideo'
import { useDispatch, useSelector } from 'react-redux'
import { changeHover, changeVideo } from '../../features/player/playerSlice'
import { useState } from 'react'

const initialState = {
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
}

function reducer(state, action) {
  switch (action.type) {
    case 'CHANGE_VIDEO':
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
    case 'CHANGE_HOVER':
      return {
        ...state,
        hover: {
          ...state.hover,
          ...action.payload,
        },
      }
    default:
      throw new Error(`Undefined action type: ${action.type}`)
  }
}

const Player = ({
  videoId,
  type,
  playlistId,
  playlistItemsId,
  scrollWidth,
}) => {
  // const [state] = useReducer(reducer, initialState)
  const [iframe, setIframe] = useState(null)
  const state = useSelector((state) => state.player)
  const dispatch = useDispatch()

  const {
    loading,
    title,
    thumbnail,
    publishedAt,
    start,
    end,
    progress,
    channelTitle,
    sound: { volume, isVolumeDragging },
    isMuted,
    isVideoDragging,
    playerState,
    isLoop,
    isShuffle,
    show,
  } = state.video
  const { isHover, hoverLeft, hoverTime } = state.hover

  const volumeEl = useRef(null)
  const videoProgressEl = useRef(null)
  const getCurrentTimeRef = useRef(null)
  const TimerRef = useRef(null)

  const toggleShowVideo = useCallback(() => {
    dispatch(changeVideo({ show: !show }))
  }, [show, dispatch])

  const onMute = useCallback(() => {
    volumeStorage.set(volume)
    iframe.mute()
    iframe.setVolume(0)

    dispatch(changeVideo({ isMuted: true, sound: { volume: 0 } }))
  }, [volume, iframe, dispatch])

  const onUnMute = useCallback(() => {
    const volume = volumeStorage.get()

    iframe.unMute()
    iframe.setVolume(volume)
    dispatch(
      changeVideo({
        isMuted: false,
        sound: { volume },
      })
    )
  }, [iframe, dispatch])

  const onPause = useCallback(() => {
    iframe.pauseVideo()
  }, [iframe])

  const onPlay = useCallback(() => {
    iframe.playVideo()
  }, [iframe])

  const nextVideo = useCallback(() => {
    iframe.nextVideo()
  }, [iframe])

  const previousVideo = useCallback(() => {
    iframe.previousVideo()
  }, [iframe])

  const onClickSetLoop = useCallback(() => {
    dispatch(changeVideo({ isLoop: !isLoop }))
  }, [isLoop, dispatch])

  const getVolumePercent = useCallback((e) => {
    const percent =
      ((e.pageX - e.currentTarget.getBoundingClientRect().x) /
        e.currentTarget.scrollWidth) *
      100

    return [percent]
  }, [])

  const onMouseDownAtVolume = useCallback(
    (e) => {
      const [percent] = getVolumePercent(e)

      iframe.setVolume(percent)

      volumeStorage.set(percent)

      dispatch(
        changeVideo({
          sound: { volume: percent, isVolumeDragging: true },
          isMuted: percent <= 0,
        })
      )
    },
    [iframe, dispatch, getVolumePercent]
  )

  const onMouseMoveAtVolume = useCallback(
    (e) => {
      if (!isVolumeDragging) return false

      const [percent] = getVolumePercent(e)

      if (percent < 0 || percent > 100) return false

      iframe.setVolume(percent)

      volumeStorage.set(percent)

      dispatch(
        changeVideo({
          sound: { volume: percent, isVolumeDragging: true },
          isMuted: percent <= 0,
        })
      )
    },
    [iframe, getVolumePercent, dispatch, isVolumeDragging]
  )

  const onMouseDown = useCallback(
    (e) => {
      const percent =
        ((e.pageX - e.currentTarget.getBoundingClientRect().x) /
          e.currentTarget.scrollWidth) *
        100
      const second = (iframe.getDuration() * percent) / 100

      iframe.seekTo(second)
      dispatch(changeVideo({ progress: percent, isVideoDragging: true }))
    },
    [iframe, dispatch]
  )

  const onMouseUp = useCallback(() => {
    isVolumeDragging &&
      dispatch(changeVideo({ sound: { isVolumeDragging: false } }))
  }, [isVolumeDragging, dispatch])

  const onMouseMove = useCallback(
    (e) => {
      let x = e.pageX - e.currentTarget.getBoundingClientRect().x
      const percent = (x / e.currentTarget.scrollWidth) * 100
      const second = Math.floor((iframe.getDuration() * percent) / 100)

      if (x <= 30) x = 30
      if (x >= e.currentTarget.scrollWidth - 30)
        x = e.currentTarget.scrollWidth - 30

      if (!isVideoDragging) return false

      iframe.seekTo(second, false)

      dispatch(
        changeHover({
          hoverTime: toHMS(second),
          hoverLeft: x,
        })
      )

      dispatch(changeVideo({ progress: percent }))
    },
    [iframe, dispatch, isVideoDragging]
  )

  const onMouseLeave = useCallback(() => {
    dispatch(changeHover({ isHover: false }))
  }, [dispatch])

  const onMouseOver = useCallback(
    (e) => {
      let x = e.pageX - e.currentTarget.getBoundingClientRect().x
      const percent = (x / e.currentTarget.scrollWidth) * 100
      const second = Math.floor((iframe.getDuration() * percent) / 100)

      if (x <= 30) x = 30
      if (x >= document.documentElement.scrollWidth - 30)
        x = document.documentElement.scrollWidth - 30

      dispatch(
        changeHover({ isHover: true, hoverTime: toHMS(second), hoverLeft: x })
      )
    },
    [dispatch, iframe]
  )

  const onMouseUpAtVideo = useCallback(
    (e) => {
      if (isVideoDragging) {
        const percent =
          ((e.pageX - 260) / videoProgressEl.current.scrollWidth) * 100
        const second = Math.floor((iframe.getDuration() * percent) / 100)

        dispatch(changeVideo({ isVideoDragging: false }))

        iframe.seekTo(second, true)
      }
    },
    [iframe, dispatch, isVideoDragging]
  )

  // iframe Video가 로딩 되었을때
  const onReady = useCallback(
    ({ target }) => {
      const hms = toHMS(target.getDuration())

      setIframe(target)

      target.playVideo()

      dispatch(
        changeVideo({
          loading: false,
          end: hms,
          sound: { volume: volumeStorage.get() || target.getVolume() },
          isMuted: target.isMuted(),
        })
      )

      volumeStorage.get() && target.setVolume(volumeStorage.get())

      window.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
          e.preventDefault()
          switch (target.getPlayerState()) {
            case 1:
              target.pauseVideo()
              break
            case 0:
            case 2:
              target.playVideo()
              break
            default:
              break
          }
        }
      })
    },
    [dispatch]
  )

  const currentTime = useCallback(() => {
    const hms = toHMS(Math.floor(iframe.getCurrentTime()))

    dispatch(
      changeVideo({
        progress: (iframe.getCurrentTime() / iframe.getDuration()) * 100,
        start: hms,
      })
    )
  }, [iframe, dispatch])

  const onStateChange = useCallback(
    async (e) => {
      switch (e.data) {
        // 버퍼링 상태
        case 3:
          return dispatch(changeVideo({ playerState: 'loading' }))
        // 재생 상태
        case 1:
          const playlist = iframe.getPlaylist()
          const {
            data: {
              items: [
                {
                  snippet: {
                    publishedAt,
                    channelTitle,
                    thumbnails: {
                      medium: { url },
                    },
                    localized: { title },
                  },
                },
              ],
            },
          } = await ytApi.getVideo(playlist[iframe.getPlaylistIndex()])

          return dispatch(
            changeVideo({
              playerState: 1,
              thumbnail: url,
              title,
              publishedAt,
              channelTitle,
              end: toHMS(iframe.getDuration()),
            })
          )

        // 정지 상태 그리고 종료  상태
        case 0:
          return dispatch(changeVideo({ playerState: e.data }))

        case 2:
          dispatch(changeVideo({ playerState: e.data }))

          return clearInterval(TimerRef.current)

        default:
          break
      }
    },
    [dispatch, iframe]
  )

  const onError = useCallback(
    (e) => {
      if (type === 'playlist' && (e.data === 101 || e.data === 150)) {
        alert('허용되지 않은 영상입니다 재생목록에서 삭제해주세요')
        iframe.nextVideo()
      }
    },
    [iframe, type]
  )

  useEffect(() => {
    if (iframe && isShuffle) {
      iframe.setShuffle(isShuffle)
    }
  }, [iframe, isShuffle])

  useEffect(() => {
    if (
      iframe &&
      iframe.getPlaylist().indexOf(videoId) !== -1 &&
      type === 'playlist'
    ) {
      iframe.playVideoAt(iframe.getPlaylist().indexOf(videoId))
    }
  }, [videoId, playlistId, iframe, type])

  useEffect(() => {
    if (playerState === 1) {
      getCurrentTimeRef.current = currentTime
      TimerRef.current = setInterval(getCurrentTimeRef.current, 1000)
    }
    return () => {
      clearInterval(TimerRef.current)
    }
  }, [playerState, currentTime])

  useEffect(() => {
    const unload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseup', onMouseUpAtVideo)
    window.addEventListener('beforeunload', unload)

    return () => {
      window.removeEventListener('moseup', onMouseUp)
      window.removeEventListener('mouseup', onMouseUpAtVideo)
      window.removeEventListener('beforeunload', unload)
    }
  })

  const onSetShuffle = () => {
    dispatch({ type: 'CHANGE_VIDEO', payload: { isShuffle: !isShuffle } })
  }

  return (
    <>
      <YtVideo
        videoId={videoId}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        type={type}
        show={show}
        playlistId={playlistId}
        loop={isLoop}
        playlistItemsId={playlistItemsId}
      />

      <Playerbar
        show={show}
        toggleShowVideo={toggleShowVideo}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onPause={onPause}
        onPlay={onPlay}
        onMute={onMute}
        onUnMute={onUnMute}
        onMouseDownAtVolume={onMouseDownAtVolume}
        onMouseMoveAtVolume={onMouseMoveAtVolume}
        onClickSetLoop={onClickSetLoop}
        onSetShuffle={onSetShuffle}
        nextVideo={nextVideo}
        previousVideo={previousVideo}
        isHover={isHover}
        hoverTime={hoverTime}
        hoverLeft={hoverLeft}
        progress={progress}
        playerState={playerState}
        isMuted={isMuted}
        isLoop={isLoop}
        isShuffle={isShuffle}
        volume={volume}
        start={start}
        end={end}
        volumeEl={volumeEl}
        videoProgressEl={videoProgressEl}
        title={title}
        thumbnail={thumbnail}
        publishedAt={publishedAt}
        channelTitle={channelTitle}
        loading={loading}
        scrollWidth={scrollWidth}
      />
    </>
  )
}

export default Player
