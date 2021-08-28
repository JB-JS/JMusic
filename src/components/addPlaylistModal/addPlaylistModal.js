import React from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import Icon from '../Icon'

const Modal = styled.div`
  position: fixed;
  top: ${(props) => props.geometry.y}px;
  left: ${(props) => props.geometry.x}px;
  display: flex;
  flex-direction: column;
  max-width: 320px;
  max-height: 470px;
  background: rgb(33, 33, 33);
  border: 1px solid var(--sidebar-border-color);
  z-index: 50;
`

const Title = styled.h2`
  padding: 1.5rem;
  border-bottom: 1px solid var(--sidebar-border-color);
  font-size: 1.25rem;
`

const List = styled.div`
  padding-top: 1rem;
  overflow-y: auto;
`

const Item = styled.div`
  padding: 0.5rem 1.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  &:hover {
    background: var(--playlist-item-bg);
  }
`

const AddPlaylistBtn = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  color: #000;
  padding: 0.625rem;
  font-size: 13px;
  cursor: pointer;
`

const AddPlaylistModal = ({ geometry, onHideModal }) => {
  const { playlists } = useSelector((state) => state.playlists)

  useEffect(() => {
    window.addEventListener('click', onHideModal)

    return () => window.removeEventListener('click', onHideModal)
  }, [onHideModal])

  return (
    <Modal geometry={geometry}>
      <Title>재생목록에 추가하기</Title>
      <List>
        {playlists.length > 0 &&
          playlists.map((item) => (
            <Item key={item.id}>{item.snippet.title}</Item>
          ))}
      </List>
      <AddPlaylistBtn>
        <Icon
          name="playlistAdd"
          fill="#000"
          style={{ width: '24px', height: '24px', marginRight: '1.25rem' }}
        />
        새 재생목록
      </AddPlaylistBtn>
    </Modal>
  )
}

export default AddPlaylistModal
