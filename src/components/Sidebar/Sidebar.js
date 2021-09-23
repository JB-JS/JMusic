import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { NavLink } from 'react-router-dom'
import SearchForm from '../SearchForm'
import Icon from '../Icon'
import SigninBtn from '../SigninBtn'
import { ytApi } from '../../lib/api/api'
import PlaylistItems from '../PlaylistItems'
import { signOut } from '../../features/user/userSlice'
import { useDispatch } from 'react-redux'
import {
  insert,
  loading,
  success,
} from '../../features/playlists/playlistsSlice'
import Avatar from '../Avatar'
import { media } from '../../lib/utils/index'
import Modal from '../Modal/Modal'

const Aside = styled.aside`
  display: grid;
  grid-template-rows: 50px auto 1fr auto;
  border-right: 1px solid var(--sidebar-border-color);
  background-color: var(--sidebar-bg);
  max-width: 280px;

  ${media.mobile`
    position: absolute;
    top: 44px;
    max-width: 100%;
    width: 100%;
    overflow: hidden;
    max-height: -webkit-fill-avilable;
    height: ${(props) =>
      props.toggleSidebar
        ? !props.isLoading
          ? 'calc(100vh - 44px - var(--player-bar-height))'
          : 'calc(100vh - 44px)'
        : '0'};
    background-color: rgb(46, 46, 46);
    transition: height 0.5s;
    z-index: 100;

    & > div:first-child {
      display: none;
    } 
  `}
`

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  padding: 0 1.5625rem;
  svg {
    fill: var(--system-primary);
  }
`

const Nav = styled.nav`
  padding: 0 1.5625rem;
  margin: 1rem 0;
  overflow: auto;
`

const Profile = styled.div`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 1.5625rem;
  border-top: 0.5px solid var(--divider);
  background: var(--sidebar-bg);
`

const UserName = styled.div`
  font-size: 0.8125rem;
`

const LogOut = styled.a`
  font-size: 0.8125rem;
  color: var(--red);
  cursor: pointer;
`

const Menu = styled(NavLink)`
  display: flex;
  align-items: center;
  font-size: 0.9375rem;
  padding: 0.25rem;
  border-radius: 6px;
  &.active {
    background: var(--sidebar-selected-bg);
  }
`

const ModalHead = styled.div`
  padding: 24px 24px 0;
`

const TitleInput = styled.input`
  width: 100%;
  line-height: 22.4px;
  font-size: 14px;
  background: none;
  ${(props) =>
    props.isFocused &&
    css`
      caret-color: rgb(62, 166, 255);
    `}
`

const ModalContent = styled.div`
  padding: 32px 24px;
`

const ModalTitle = styled.h2`
  font-size: 20px;
`

const Void = styled.div`
  visibility: hidden;
  line-height: ${(props) => props.lh || '20px'};
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

const InputBlock = styled.div`
  position: relative;
  margin-bottom: 2px;
  background: none;
  width: 100%;
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

const Description = styled.div`
  margin: 32px 0 40px;

  ${InputBlock} {
    line-height: 1.6;
  }
`

const DescriptionTextarea = styled.textarea`
  width: 100%;
  caret-color: ${(props) => props.isFocused && 'rgb(62, 166, 255)'};
  resize: none;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
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

    &:last-child {
      background: #fff;
      border-radius: 2px;
      color: #000;
    }
  }
`

const Sidebar = ({ toggleSidebar, setToggleSidebar }) => {
  const { displayName, photoURL, isLoggedIn, access_token } = useSelector(
    (state) => state.user
  )

  const {
    playlists: { playlists },
    player: {
      video: { loading: isLoading },
    },
  } = useSelector((state) => state)

  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [inputs, setInputs] = useState({
    title: '',
    description: '',
    isFocus: { title: false, description: false },
  })

  const { title, description, isFocus } = inputs

  const titleInputRef = useRef(null)

  const onClick = () => {
    dispatch(signOut())
  }

  const onAddPlaylist = useCallback(async () => {
    const { data } = await ytApi.addPlaylist(
      {
        title,
        description,
      },
      access_token
    )

    dispatch(insert(data))

    setIsOpen(false)
  }, [title, description, access_token, dispatch])

  const onChange = useCallback((e) => {
    const {
      target: { name, value },
    } = e

    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
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

  useEffect(() => {
    isOpen && titleInputRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    const fetchPlaylists = async () => {
      dispatch(loading())

      try {
        const {
          data: { items },
        } = await ytApi.getPlaylists(access_token)

        dispatch(success(items))
      } catch (err) {
        console.log(err.response, window.googleUser)
        if (err.response.status === 401) {
          // window.googleUser.reloadAuthResponse()
        }
      }
    }

    isLoggedIn && fetchPlaylists()
  }, [isLoggedIn, access_token, dispatch])

  return (
    <>
      <Aside toggleSidebar={toggleSidebar} isLoading={isLoading}>
        {!toggleSidebar && (
          <Logo>
            <a href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="83"
                height="20"
                viewBox="0 0 83 20"
                version="1.1"
                role="presentation"
              >
                <path
                  fillRule="nonzero"
                  stroke="none"
                  strokeWidth="1"
                  d="M34.752 19.746V6.243h-.088l-5.433 13.503h-2.074L21.711 6.243h-.087v13.503h-2.548V1.399h3.235l5.833 14.621h.1L34.064 1.4h3.248v18.347h-2.56zm16.649 0h-2.586v-2.263h-.062c-.725 1.602-2.061 2.504-4.072 2.504-2.86 0-4.61-1.894-4.61-4.958V6.37h2.698v8.125c0 2.034.95 3.127 2.81 3.127 1.95 0 3.124-1.373 3.124-3.458V6.37H51.4v13.376zm7.394-13.618c3.06 0 5.046 1.73 5.134 4.196h-2.536c-.15-1.296-1.087-2.11-2.598-2.11-1.462 0-2.436.724-2.436 1.793 0 .839.6 1.41 2.023 1.741l2.136.496c2.686.636 3.71 1.704 3.71 3.636 0 2.442-2.236 4.12-5.333 4.12-3.285 0-5.26-1.64-5.509-4.183h2.673c.25 1.398 1.187 2.085 2.836 2.085 1.623 0 2.623-.687 2.623-1.78 0-.865-.487-1.373-1.924-1.704l-2.136-.508c-2.498-.585-3.735-1.806-3.735-3.75 0-2.391 2.049-4.032 5.072-4.032zM66.1 2.836c0-.878.7-1.577 1.561-1.577.862 0 1.55.7 1.55 1.577 0 .864-.688 1.576-1.55 1.576a1.573 1.573 0 0 1-1.56-1.576zm.212 3.534h2.698v13.376h-2.698V6.37zm14.089 4.603c-.275-1.424-1.324-2.556-3.085-2.556-2.086 0-3.46 1.767-3.46 4.64 0 2.938 1.386 4.642 3.485 4.642 1.66 0 2.748-.928 3.06-2.48H83C82.713 18.067 80.477 20 77.317 20c-3.76 0-6.208-2.62-6.208-6.942 0-4.247 2.448-6.93 6.183-6.93 3.385 0 5.446 2.213 5.683 4.845h-2.573zM10.824 3.189c-.698.834-1.805 1.496-2.913 1.398-.145-1.128.41-2.33 1.036-3.065C9.644.662 10.848.05 11.835 0c.121 1.178-.336 2.33-1.01 3.19zm.999 1.619c.624.049 2.425.244 3.578 1.98-.096.074-2.137 1.272-2.113 3.79.024 3.01 2.593 4.012 2.617 4.037-.024.074-.407 1.419-1.344 2.812-.817 1.224-1.657 2.422-3.002 2.447-1.297.024-1.73-.783-3.218-.783-1.489 0-1.97.758-3.194.807-1.297.048-2.28-1.297-3.097-2.52C.368 14.908-.904 10.408.825 7.375c.84-1.516 2.377-2.47 4.034-2.495 1.273-.023 2.45.857 3.218.857.769 0 2.137-1.027 3.746-.93z"
                ></path>
              </svg>
            </a>
          </Logo>
        )}
        <SearchForm />
        <Nav>
          <ul>
            <li>
              <Menu to="/" exact>
                <Icon
                  name="viewRect"
                  style={{ marginRight: '0.5rem', fill: 'var(--red)' }}
                />
                <span>둘러보기</span>
              </Menu>
            </li>
          </ul>

          {isLoggedIn && playlists.length > 0 && (
            <PlaylistItems
              title="플레이리스트"
              items={playlists}
              setToggleSidebar={setToggleSidebar}
              setIsOpen={setIsOpen}
            />
          )}
        </Nav>

        <Profile>
          {isLoggedIn ? (
            <>
              <Avatar src={photoURL} alt="user Profile" />
              <div>
                <UserName>{displayName}</UserName>
                <LogOut onClick={onClick}>로그아웃</LogOut>
              </div>
            </>
          ) : (
            <SigninBtn />
          )}
        </Profile>
      </Aside>
      {isOpen && (
        <Modal>
          <ModalHead>
            <ModalTitle>새 재생목록</ModalTitle>
          </ModalHead>
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
            <ActionBtn>
              <button type="button" onClick={() => setIsOpen(false)}>
                취소
              </button>
              <button type="button" onClick={onAddPlaylist}>
                저장
              </button>
            </ActionBtn>
          </ModalContent>
        </Modal>
      )}
    </>
  )
}

export default Sidebar
