import React, { useCallback, useEffect, useReducer } from 'react'
import styled, { css } from 'styled-components'
import Icon from '../../components/Icon'
import { ytApi } from '../../lib/api/api'
import { HourMinute } from '../../lib/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { media } from '../../lib/utils/index'
import Modal from '../../components/Modal/Modal'
import Skeleton from '@material-ui/lab/Skeleton'
import { useRef } from 'react'
import { update } from '../../features/playlists/playlistsSlice'
import ContextMenu from '../../components/ContextMenu'

const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 3px;
`

const InfoContainer = styled.div`
  padding: 2.5rem;
`

const ItemHead = styled.div`
  display: flex;
  margin-bottom: 2.5rem;
  ${media.desktop`
    flex-direction: column;
    align-items: center;
    `}
`

const HeadThumbnail = styled.img`
  max-width: 270px;
  width: 100%;
  height: 270px;
  object-fit: cover;
  box-shadow: 0 10px 20px 0 var(--playlist-shadow-color);

  border-radius: 6px;
`

const HeadContent = styled.div`
  margin-top: 50px;
  margin-left: 2.125rem;
  flex: 1;
  ${media.desktop`
  margin: 1rem 0 0 0;
  text-align: center;
  `}

  font-size: 0.8125rem;
  font-weight: 200;
  color: var(--system-primary);
`

const HeadTitle = styled.h1`
  margin-top: auto;
  margin-bottom: 1rem;
  font-size: 1.625rem;
  font-weight: 600;
  color: var(--system-primary);
`

const SingCnt = styled.div`
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`

const PlayBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 40px;
  border-radius: 4px;
  background: var(--red);
  color: #fff;
  cursor: pointer;
`

const Thead = styled.th`
  font-size: 0.75rem;
  color: var(--system-secondary);
  font-weight: normal;
  text-align: left;
  padding-bottom: 0.375rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0px;
  table-layout: fixed;

  & > thead {
    ${media.desktop`display: none;`}
  }
  ${Thead}:not(:first-child) {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: -15px;
      top: calc(50% - 3px);
      height: 16px;
      width: 1px;
      border-radius: 0.5px;
      background: var(--system-secondary);
      transform: translateY(-50%);
    }
  }
`

const Tbody = styled.tbody`
  font-size: 0.8125rem;
  font-weight: normal;
  color: var(--system-secondary);
`

const Overlay = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
`

const TbodyRow = styled.tr`
  height: 54px;
  background: ${(props) => props.even && 'var(--musicItem-even-bg)'};

  & > td:nth-child(2),
  & > td:nth-child(3) {
    @media (max-width: 1040px) {
      display: none;
    }
  }

  > td:first-child {
    padding-left: 0.375rem;
  }

  > td:last-child {
    border-radius: 0 5px 5px 0;
    padding-right: 18px;
  }

  &:hover {
    background: var(--tracklist-hover-bg);
  }

  &:hover ${Overlay} {
    opacity: 1;
  }
`

const MusicData = styled.td`
  display: flex;
  align-items: center;
  height: 54px;

  & > div:nth-child(2) {
    flex-shrink: 1;
    min-width: 0;
  }
`

const ImgContainer = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  margin-right: 1.25rem;
  cursor: pointer;
`

const ItemTitle = styled.h2`
  font-size: 13px;
  font-weight: 400;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
`

const Artist = styled.div`
  display: none;
  @media (max-width: 1040px) {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 167px;
  height: 40px;
  border: 1px solid #fff;
  border-radius: 2px;
  margin-left: 20px;
  background: none;
  cursor: pointer;
  transition: color 0.5s, background 1s;
  color: #fff;
  &:hover {
    background: #fff;
    color: #000;
  }
`

const ButtonBlock = styled.div`
  display: flex;
  margin-top: 20px;
`

const Title = styled.h2`
  font-size: 20px;
`

const Form = styled.div`
  & > div {
    &:first-child {
      padding: 24px 24px;
    }

    &:nth-child(2) {
      padding: 32px 24px;

      textarea {
        font-size: 14px;
        font-family: inherit;
        font-weight: normal;
      }

      textarea,
      input {
        width: 100%;
        border: none;
        background: none;
        resize: none;
        outline: none;
      }
    }
  }
`

const InputBlock = styled.div`
  position: relative;
  margin-bottom: 2px;
`

const ModalContent = styled.div`
  border-top: 1px solid rgb(96, 96, 96);
  border-bottom: 1px solid rgb(96, 96, 96);
  font-size: 14px;

  color: #fff;

  & > div:first-child ${InputBlock} {
    margin-bottom: 3px;
  }
`

const Void = styled.div`
  visibility: hidden;
  line-height: ${(props) => props.lh || '20px'};
`

const ActionBtn = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;

  & > button {
    width: 75px;
    height: 36px;
    cursor: pointer;

    &:first-child {
      background: none;
    }

    &[type='submit'] {
      background: #fff;
      border-radius: 2px;
      color: #000;
    }
  }
`

const Description = styled.div`
  margin: 32px 0 40px;

  ${InputBlock} {
    line-height: 1.6;
  }
`

const DescriptionTextarea = styled.textarea`
  caret-color: ${(props) => props.isFocused && 'rgb(62, 166, 255)'};
`

const TitleInput = styled.input`
  line-height: 22.4px;
  ${(props) =>
    props.isFocused &&
    css`
      caret-color: rgb(62, 166, 255);
    `}
`

const Underline = styled.div`
  position: relative;
  height: 2px;

  background-color: rgb(66, 66, 66);

  & > div {
    height: 100%;
    background: rgb(62, 166, 255);
    transform-origin: center;
    transform: scale(0);
    ${(props) =>
      props.isFocused &&
      css`
        transform: none;
        transition: transform 0.5s;
      `}
  }
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  color: rgba(255, 255, 255, 0.7);
  font-weight: lighter;
  font-size: 16px;
  transition: 0.25s;
  transform-origin: left top;

  ${(props) =>
    props.isValue &&
    props.isFocused &&
    css`
      color: rgb(62, 166, 255);
    `}

  ${(props) =>
    props.isValue &&
    css`
      transform: translateY(-75%) scale(0.75);
      padding-bottom: 8px;
    `}
`

const TextareaBlock = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 3px;

  ${Void} {
    white-space: pre-wrap;
    ${(props) =>
      props.isFocused &&
      css`
        caret-color: rgb(62, 166, 255);
      `}
  }

  & > div > div:last-child {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    & > textarea {
      line-height: 22.4px;
      font-weight: normal;
      font-family: inherit;
      height: 100%;
    }
  }
`

const HeadDescription = styled.p`
  max-width: 640px;
  width: 100%;
  text-align: justify;
  line-height: 1.8;
  white-space: pre-wrap;
`

const HideList = styled.ul`
  position: absolute;
  bottom: 0;
  right: -2px;
  display: none;
  max-width: 385px;
  min-width: 185px;
  width: 100%;
  max-height: 300px;
  overflow-y: scroll;
  padding: 15px 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2),
    0 8px 40px rgba(0, 0, 0, 0.25);
  background: var(--contextmenu-bg);
  backdrop-filter: blur(70px) saturate(210%);
  z-index: 9992;
  transform: ${(props) =>
    props.over ? 'translateX(-100%)' : 'translate(100%)'};

  & > li {
    display: flex;
    align-items: center;
    padding: 0 10px;
    height: 32px;

    &:hover {
      background-color: rgba(60, 60, 60, 0.7);
    }
  }
`

const PlaylistIcon = styled.span`
  &::before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
    background-image: url('https://music.apple.com/assets/web-nav/sidebar_GenericPlaylist.svg');
    background-repeat: no-repeat;
    opacity: 0.5;
    @media only screen and (prefers-color-scheme: dark) {
      background-image: url('https://music.apple.com/assets/web-nav/sidebar_GenericPlaylist_onDark.svg');
    }
  }
`

const PlaylistTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ContextList = styled.ul``

const DropDown = styled.div``

const ContextItem = styled.li`
  position: relative;
  padding: 0 40px 0 10px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;

  & > div:first-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
  }

  &:hover {
    background-color: rgba(60, 60, 60, 0.7);
  }

  & > span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &:hover > ${HideList} {
    display: block;
  }
`

const initialState = {
  isLoading: false,
  datas: null,
  error: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, isLoading: true, error: null }

    case 'SUCCESS':
      return { ...state, isLoading: false, datas: action.datas, error: null }

    case 'ERROR':
      return { ...state, isLoading: false, error: action.error }

    case 'UPDATE':
      return {
        ...state,
        datas: {
          ...state.datas,
          listData: {
            ...state.datas.listData,
            items: [action.datas],
          },
        },
      }

    case 'REMOVE_PLAYLISTITEM':
      return {
        ...state,
        datas: {
          ...state.datas,
          itemData: {
            ...state.datas.itemData,
            items: state.datas.itemData.items.filter(
              (item) => item.id !== action.payload.id
            ),
          },
        },
      }

    case 'INSERT_PLAYLISTITEM':
      return {
        ...state,
        datas: {
          ...state.datas,
          listData: {
            ...state.datas.listData,
          },
          itemData: {
            ...state.datas.itemData,
            items: state.datas.itemData.items.concat(action.payload),
          },
        },
      }

    default:
      throw new Error(`is not Valid Action type: ${action.type}`)
  }
}

const Playlist = ({ match, setVideo, setPlaylistItemsId }) => {
  const playlistId = match.params.playlistId

  const [state, dispatch] = useReducer(reducer, initialState)
  const [isOpen, setIsOpen] = useState(false)
  const [contextMenu, setContextMenu] = useState({
    show: false,
    itemId: null,
    resourceId: null,
  })
  const [location, setLocation] = useState({
    x: 0,
    y: 0,
  })
  const [over, setOver] = useState({
    overX: false,
  })
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    isFocus: { title: false, description: false },
  })

  const titleInputRef = useRef(null)
  const menuRef = React.createRef()

  const {
    playlists: { playlists },
    user: { access_token },
  } = useSelector((state) => state)

  const { loading, error, datas } = state

  const reduxDispatch = useDispatch()

  const { title, description, isFocus } = inputs

  const getPlaylist = useCallback(async () => {
    const { data: itemData } = await ytApi.getPlaylistItems(
      playlistId,
      access_token
    )

    const { data: listData } = await ytApi.getPlaylistsById(
      playlistId,
      access_token
    )

    const timeItems =
      itemData.items.length > 0 &&
      (
        await Promise.all(
          itemData.items.map((item) =>
            ytApi.getVideoTime(item.snippet.resourceId.videoId, access_token)
          )
        )
      )
        .filter((el) => el.data.items.length > 0)
        .map((el) => {
          const duration = el.data.items[0].contentDetails.duration

          const [min, sec] = duration
            .substring(2, duration.length - 1)
            .split('M')
            .join('')

          return { duration: `${min}:${sec >= 10 ? sec : `0${sec || '0'}`}` }
        })

    let time = 0

    // 플레이리스트 아이템 요소들 시간 더해서 변수에 저장하기
    timeItems &&
      timeItems.forEach(({ duration }) => {
        const [min, sec = 0] = duration.split(':')

        time = time + parseInt(min * 60) + parseInt(sec)
      })

    return {
      listData: { ...listData, totalTime: HourMinute(time) },
      itemData: {
        ...itemData,
        items: [
          ...itemData.items
            .filter((item) => Object.keys(item.snippet.thumbnails).length)
            .map((item, idx) => ({ ...item, ...timeItems[idx] })),
        ],
      },
    }
  }, [playlistId, access_token])

  const fetchData = useCallback(async () => {
    dispatch({ type: 'LOADING' })

    try {
      const datas = await getPlaylist()

      dispatch({ type: 'SUCCESS', datas })
    } catch (error) {
      dispatch({ type: 'ERROR', error })
    }
  }, [getPlaylist])

  const onClick = async (e) => {
    const {
      dataset: { videoid: videoId, playlistid: playlistId },
    } = e.currentTarget

    setPlaylistItemsId(
      datas.itemData.items.map((item) => item.snippet.resourceId.videoId)
    )

    setVideo({
      videoId,
      playlistId,
      isPlayed: true,
      type: 'playlist',
    })
  }

  const onChange = useCallback((e) => {
    const {
      target: { name, value },
    } = e

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }, [])

  const onFocus = useCallback((e) => {
    const {
      target: { name },
    } = e

    setInputs((prevState) => ({
      ...prevState,
      isFocus: {
        ...prevState.isFocus,
        [name]: true,
      },
    }))
  }, [])

  const onBlur = useCallback((e) => {
    const {
      target: { name },
    } = e

    setInputs((prevState) => ({
      ...prevState,
      isFocus: {
        ...prevState.isFocus,
        [name]: false,
      },
    }))
  }, [])

  const onModalOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onModalClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onRemovePlaylistItem = useCallback(() => {
    const id = contextMenu.itemId

    console.log(contextMenu.itemId)

    ytApi.removePlaylistItems(id, access_token)

    dispatch({
      type: 'REMOVE_PLAYLISTITEM',
      payload: {
        id,
      },
    })

    setContextMenu((prevState) => ({ ...prevState, show: false }))
  }, [access_token, contextMenu.itemId])

  const onOpenContextMenu = useCallback((e, resourceId) => {
    const rect = e.target.getBoundingClientRect()
    console.log(rect)

    setLocation({ x: rect.x, y: rect.y + rect.height })

    setContextMenu((prevState) => ({
      ...prevState,
      show: true,
      itemId: e.target.dataset.id,
      resourceId,
    }))
  }, [])

  const onAddPlaylistData = useCallback(
    async (playlistId) => {
      const { data } = await ytApi.insertPlaylistData(
        {
          playlistId,
          resourceId: contextMenu.resourceId,
        },
        access_token
      )

      const time = await ytApi.getVideoTime(
        contextMenu.resourceId.videoId,
        access_token
      )

      console.log('time', time)

      dispatch({ type: 'INSERT_PLAYLISTITEM', payload: { ...data } })
    },
    [contextMenu.resourceId, access_token]
  )

  const onUpdate = useCallback(async () => {
    const { data } = await ytApi.updatePlaylist(playlistId, access_token, {
      title,
      description,
    })

    dispatch({ type: 'UPDATE', datas: data })
    reduxDispatch(update({ id: playlistId, data }))
    setIsOpen(false)
  }, [playlistId, access_token, title, description, reduxDispatch])

  useEffect(() => {
    isOpen && titleInputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    menuRef.current &&
      menuRef.current.offsetWidth + location.x > window.innerWidth &&
      setOver({ overX: true, overY: false })
  }, [location.x])

  useEffect(() => {
    if (datas && datas.listData.items.length > 0) {
      setInputs({
        isFocus: { title: false, description: false },
        title: datas.listData.items[0].snippet.title,
        description: datas.listData.items[0].snippet.description,
      })
    }
  }, [datas])

  if (error) return <div>에러가 발생했습니다!</div>

  return (
    <InfoContainer>
      {console.log(datas)}
      <>
        <ItemHead>
          {datas && datas.itemData ? (
            <HeadThumbnail
              src={
                datas && datas.itemData.items.length <= 0
                  ? 'https://lh3.googleusercontent.com/R2Of6QakdNj2LM_3i9WK2Uqn3Jl0GVZKp6-4gY5PqOFdlvx09K4RrR3koGMOK5qls0gAJNXeS-oN91Wf=s576'
                  : datas.itemData.items[0].snippet.thumbnails.medium.url
              }
              alt="playlist thumbnail"
            />
          ) : (
            <Skeleton
              variant="rect"
              style={{ borderRadius: '4px' }}
              width={270}
            >
              <HeadThumbnail />
            </Skeleton>
          )}
          <HeadContent>
            <HeadTitle>
              {datas ? (
                datas.listData.items[0].snippet.title
              ) : (
                <Skeleton
                  style={{ marginBottom: '1rem' }}
                  variant="text"
                  width={320}
                  height={33}
                />
              )}
            </HeadTitle>

            <div>
              {datas ? (
                <>
                  <span>재생목록</span>
                  <span> • </span>
                  <span>{datas.listData.items[0].snippet.channelTitle}</span>
                </>
              ) : (
                <Skeleton variant="text" width={160} />
              )}
            </div>
            <SingCnt>
              {datas ? (
                <>
                  <span>노래 {datas.itemData.items.length}곡</span>
                  <span> • </span>
                  <span>{datas.listData.totalTime}</span>
                </>
              ) : (
                <Skeleton variant="text" width={160} />
              )}
            </SingCnt>
            <HeadDescription>
              {datas ? (
                datas.listData.items[0].snippet.description
              ) : (
                <Skeleton variant="text" width="100%" />
              )}
            </HeadDescription>
            <ButtonBlock>
              <div style={{ marginTop: 'auto' }}>
                {datas ? (
                  datas.itemData.items.length > 0 ? (
                    <PlayBtn
                      onClick={onClick}
                      data-videoid={
                        datas.itemData.items[0].snippet.resourceId.videoId
                      }
                      data-playlistid={playlistId}
                    >
                      <Icon
                        name="play"
                        style={{
                          fill: '#fff',
                          width: '24px',
                          height: '24px',
                          marginRight: '0.25rem',
                        }}
                      />
                      재생
                    </PlayBtn>
                  ) : (
                    ''
                  )
                ) : (
                  <Skeleton
                    width={90}
                    height={40}
                    variant="rect"
                    style={{ borderRadius: '4px' }}
                  ></Skeleton>
                )}
              </div>
              <div>
                {datas ? (
                  <EditBtn onClick={onModalOpen}>
                    <Icon
                      name="edit"
                      style={{
                        width: '24px',
                        height: '24px',
                        marginRight: '8px',
                      }}
                    />
                    재생목록 수정
                  </EditBtn>
                ) : (
                  <Skeleton
                    variant="rect"
                    width={167}
                    height={40}
                    style={{ marginLeft: '20px', borderRadius: '4px' }}
                  />
                )}
              </div>
            </ButtonBlock>
          </HeadContent>
        </ItemHead>

        <Table>
          <thead>
            <tr>
              <Thead width="40%" style={{ paddingLeft: '0.375rem' }}>
                노래
              </Thead>
              <Thead width="25%">앨범</Thead>
              <Thead width="25%">아티스트</Thead>
              <Thead width="15%">시간</Thead>
            </tr>
          </thead>
          <Tbody>
            {datas && datas.itemData.items.length > 0 ? (
              datas.itemData.items.map((item, idx) => (
                <TbodyRow key={item.id} even={idx % 2 === 0}>
                  <MusicData>
                    <ImgContainer
                      onClick={onClick}
                      data-playlistid={playlistId}
                      data-videoid={item.snippet.resourceId.videoId}
                    >
                      <Thumbnail
                        src={item.snippet.thumbnails.medium.url}
                        alt="video thumbnail"
                      />
                      <Overlay>
                        <Icon name="play" width="24" height="24" fill="#fff" />
                      </Overlay>
                    </ImgContainer>
                    <div>
                      <ItemTitle>{item.snippet.title}</ItemTitle>
                      <Artist>
                        <span>{item.snippet.videoOwnerChannelTitle}</span>
                      </Artist>
                    </div>
                  </MusicData>
                  <td></td>
                  <td>
                    <div>{item.snippet.videoOwnerChannelTitle}</div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}
                    >
                      {item.duration}

                      {
                        <Icon
                          name="contextMenu"
                          style={{
                            width: '14px',
                            height: '14px',
                            fill: '#fa586a',
                            marginLeft: '16px',
                            cursor: 'pointer',
                          }}
                          data-id={item.id}
                          onClick={(e) =>
                            onOpenContextMenu(e, item.snippet.resourceId)
                          }
                        />
                      }
                    </div>
                  </td>
                </TbodyRow>
              ))
            ) : (
              <tr></tr>
            )}
          </Tbody>
        </Table>
      </>
      {isOpen && (
        <Modal>
          <Form>
            <div>
              <Title>{datas && datas.listData.items[0].snippet.title}</Title>
            </div>
            <ModalContent>
              <div>
                <Void>&nbsp;</Void>
                <InputBlock>
                  <Label
                    htmlFor="title"
                    isValue={title !== ''}
                    isFocused={isFocus.title}
                  >
                    제목
                  </Label>
                  <TitleInput
                    type="text"
                    value={title}
                    id="title"
                    onChange={onChange}
                    onKeyDown={(e) => {
                      e.stopPropagation()
                    }}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    name="title"
                    autoComplete="off"
                    isFocused={isFocus.title}
                    ref={titleInputRef}
                  />
                </InputBlock>
                <Underline isFocused={isFocus.title}>
                  <div></div>
                </Underline>
              </div>
              <Description>
                <Void>&nbsp;</Void>
                <InputBlock>
                  <Void>&nbsp;</Void>
                  <TextareaBlock isFocused={isFocus.description}>
                    <Label
                      htmlFor="description"
                      isValue={description}
                      isFocused={isFocus.description}
                    >
                      설명
                    </Label>
                    <div>
                      <Void lh="22.4px">{description}&nbsp;</Void>
                      <div>
                        <DescriptionTextarea
                          type="text"
                          autoComplete="off"
                          id="description"
                          onChange={onChange}
                          onKeyDown={(e) => {
                            e.stopPropagation()
                          }}
                          onBlur={onBlur}
                          onFocus={onFocus}
                          name="description"
                          value={description}
                          isFocused={isFocus.description}
                          rows={1}
                        />
                      </div>
                    </div>
                  </TextareaBlock>
                </InputBlock>
                <Underline isFocused={isFocus.description}>
                  <div></div>
                </Underline>
              </Description>
            </ModalContent>
            <ActionBtn>
              <button type="button" onClick={onModalClose}>
                취소
              </button>
              <button type="button" onClick={onUpdate}>
                저장
              </button>
            </ActionBtn>
          </Form>
        </Modal>
      )}
      {contextMenu.show && (
        <ContextMenu
          location={location}
          over={over}
          ref={menuRef}
          setIsContextMenu={setContextMenu}
          contextMenu={contextMenu}
        >
          <ContextList>
            <ContextItem onClick={onRemovePlaylistItem}>
              <div>
                <span
                  onClick={() =>
                    setContextMenu({ ...contextMenu, show: false })
                  }
                >
                  재생목록에서 삭제
                </span>
                <Icon
                  name="playlistRemove"
                  width="18"
                  height="18"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    fill: '#aaa',
                    marginLeft: '0.5rem',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </ContextItem>
            <ContextItem>
              <div>
                <DropDown
                  onClick={() =>
                    setContextMenu({ ...contextMenu, show: false })
                  }
                >
                  재생목록에 추가
                </DropDown>
                <Icon
                  name="playlistAdd"
                  width="18"
                  height="18"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    fill: '#aaa',
                    marginLeft: '0.5rem',
                    cursor: 'pointer',
                  }}
                />
              </div>
              <HideList over={over.overX}>
                {playlists.length > 0 &&
                  playlists.map((playlist) => (
                    <li
                      key={playlist.id}
                      onClick={() => {
                        onAddPlaylistData(playlist.id)
                        setContextMenu({ ...contextMenu, show: false })
                      }}
                    >
                      <PlaylistIcon />
                      <PlaylistTitle>{playlist.snippet.title}</PlaylistTitle>
                    </li>
                  ))}
              </HideList>
            </ContextItem>
          </ContextList>
        </ContextMenu>
      )}
    </InfoContainer>
  )
}

export default Playlist
