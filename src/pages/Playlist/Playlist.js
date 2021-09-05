import React, { useCallback, useEffect, useReducer } from 'react'
import styled, { css } from 'styled-components'
import Icon from '../../components/Icon'
import { ytApi } from '../../lib/api/api'
import { HourMinute } from '../../lib/utils'
import { useSelector } from 'react-redux'
import { media } from '../../lib/utils/index'
import { useState } from 'react'
import Modal from '../../components/Modal/Modal'

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
  @media (max-width: 1000px) {
    flex-direction: column;
    align-items: center;
  }
`

const HeadThumbnail = styled.img`
  max-width: 270px;
  height: 270px;
  object-fit: cover;
  box-shadow: 0 10px 20px 0 var(--playlist-shadow-color);
  border-radius: 6px;
`

const HeadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 2.125rem;
  ${media.desktop`
  align-items: center;
  margin: 1rem 0 0 0;
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
  border-radius: 5px;
  padding: 0.625rem 1.25rem;
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
    width: 50%;
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
  height: 100%;
  padding: 0 30px;
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

const Title = styled.h2``

const Form = styled.form`
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

const ModalContent = styled.div`
  border-top: 1px solid rgb(96, 96, 96);
  border-bottom: 1px solid rgb(96, 96, 96);
`

const InputBlock = styled.div`
  position: relative;
`

const Void = styled.div`
  line-height: 20px;
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

const Underline = styled.div`
  position: relative;
  height: 2px;
  margin-top: 3px;
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
  left: 0;
  color: rgba(255, 255, 255, 0.7);
  font-weight: lighter;
  font-size: 1rem;
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
    `}
`

const TextareaBlock = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
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

    case 'REMOVE_PLAYLISTITEM':
      return {
        ...state,
        datas: {
          ...state.datas,
          itemData: {
            items: state.datas.itemData.items.filter(
              (item) => item.id !== action.payload.id
            ),
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
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    isFocus: { title: false, description: false },
  })

  const { access_token } = useSelector((state) => state.user)

  const { title, description, isFocus } = inputs
  const { loading, error, datas } = state

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

  const onPlaylistRemoveItem = (e) => {
    const id = e.currentTarget.dataset.itemid

    ytApi.removePlaylistItems(id, access_token)

    dispatch({
      type: 'REMOVE_PLAYLISTITEM',
      payload: {
        id,
      },
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

    console.log('inputs')

    setInputs((prevState) => ({
      ...prevState,
      isFocus: {
        ...prevState.isFocus,
        [name]: true,
      },
    }))
  })

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

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (loading) return <div>로딩중입니다...</div>
  if (error) return <div>에러가 발생했습니다!</div>

  return (
    <InfoContainer>
      {datas && (
        <>
          <ItemHead>
            <HeadThumbnail
              src={
                datas && datas.itemData.items.length <= 0
                  ? 'https://lh3.googleusercontent.com/R2Of6QakdNj2LM_3i9WK2Uqn3Jl0GVZKp6-4gY5PqOFdlvx09K4RrR3koGMOK5qls0gAJNXeS-oN91Wf=s576'
                  : datas.listData.items[0].snippet.thumbnails.medium.url
              }
              alt="playlist thumbnail"
            />
            <HeadContent>
              <HeadTitle>
                {datas && datas.listData.items[0].snippet.title}
              </HeadTitle>
              <div>
                <span>재생목록</span>
                <span> • </span>
                <span>{datas.listData.items[0].snippet.channelTitle}</span>
              </div>
              <SingCnt>
                <span>노래 {datas.itemData.items.length}곡</span>
                <span> • </span>
                <span>{datas.listData.totalTime}</span>
              </SingCnt>
              {datas.listData.items[0].snippet.description && (
                <p>{datas.listData.items[0].snippet.description}</p>
              )}
              <ButtonBlock>
                <div style={{ marginTop: 'auto' }}>
                  {datas.itemData.items.length > 0 && (
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
                  )}
                </div>
                <div>
                  <EditBtn onClick={() => setIsOpen(true)}>
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
                </div>
              </ButtonBlock>
            </HeadContent>
          </ItemHead>
          {datas.itemData.items.length > 0 && (
            <Table>
              <thead>
                <tr>
                  <Thead width="40%" style={{ paddingLeft: '0.375rem' }}>
                    노래
                  </Thead>
                  <Thead width="25%">앨범</Thead>
                  <Thead width="25%">아티스트</Thead>
                  <Thead>시간</Thead>
                </tr>
              </thead>
              <Tbody>
                {datas.itemData.items.map((item, idx) => (
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
                          <Icon
                            name="play"
                            width="24"
                            height="24"
                            fill="#fff"
                          />
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
                        }}
                      >
                        {item.duration}
                        {/* <Icon
                          name="playlistRemove"
                          width="24"
                          height="24"
                          data-itemid={item.id}
                          onClick={onPlaylistRemoveItem}
                          style={{
                            fill: 'var(--theme-color)',
                            marginLeft: '0.5rem',
                            cursor: 'pointer',
                          }}
                        /> */}
                      </div>
                    </td>
                  </TbodyRow>
                ))}
              </Tbody>
            </Table>
          )}
        </>
      )}
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
                    isValue={title}
                    isFocused={isFocus.title}
                  >
                    제목
                  </Label>
                  <input
                    type="text"
                    value={title}
                    id="title"
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    name="title"
                    autoComplete="off"
                  />
                  {console.log}

                  <Underline isFocused={isFocus.title}>
                    <div></div>
                  </Underline>
                </InputBlock>
              </div>
              <Description>
                <Void>&nbsp;</Void>
                <InputBlock>
                  <Void>&nbsp;</Void>
                  <TextareaBlock>
                    <Label
                      htmlFor="description"
                      isValue={description}
                      isFocused={isFocus.description}
                    >
                      설명
                    </Label>
                    <textarea
                      type="text"
                      id="description"
                      value={description}
                      onChange={onChange}
                      onBlur={onBlur}
                      onFocus={onFocus}
                      name="description"
                      autoComplete="off"
                    />
                  </TextareaBlock>
                </InputBlock>
                <Underline isFocused={isFocus.description}>
                  <div></div>
                </Underline>
              </Description>
            </ModalContent>
            <ActionBtn>
              <button>취소</button>
              <button type="submit">저장</button>
            </ActionBtn>
          </Form>
        </Modal>
      )}
    </InfoContainer>
  )
}

export default Playlist
