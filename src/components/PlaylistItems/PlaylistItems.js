import React, { useState } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const List = styled.ul`
  background-color: ${(props) => props.current && 'var(--sidebar-selected-bg)'};
`

const SLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: 0.25rem;
  width: 100%;
  &.active {
    background: var(--sidebar-selected-bg);
  }
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

const Title = styled.div`
  font-size: 0.625rem;
  line-height: 1.3;
  margin-top: 1.375rem;
  margin-bottom: 0.25rem;
  opacity: 0.5;
`

const PlaylistTitle = styled.span`
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

const Item = styled.li`
  border-radius: 6px;
  background-color: ${({ current }) => current && 'var(--sidebar-selected-bg)'};
`
const AddPlaylistItem = styled.li`
  display: flex;
  align-items: center;
  border-radius: 6px;
  padding: 0.25rem;
  cursor: pointer;
  & > svg {
    fill: #fff;
    margin-right: 0.5rem;
  }
`

const PlaylistItems = ({ title, items, setToggleSidebar, setIsOpen }) => {
  return (
    <>
      {title && <Title>{title}</Title>}
      <List>
        <AddPlaylistItem onClick={() => setIsOpen(true)}>
          <svg
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            style={{ width: '24px', height: '24px' }}
          >
            <g>
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
            </g>
          </svg>
          새 재생목록
        </AddPlaylistItem>
        {items &&
          items.length > 0 &&
          items.map((item) => (
            <Item
              key={item.id}
              {...(setToggleSidebar ? { onClick: setToggleSidebar } : {})}
            >
              <SLink to={`/playlist/${item.id}`}>
                <PlaylistTitle>{item.snippet.title}</PlaylistTitle>
              </SLink>
            </Item>
          ))}
      </List>
    </>
  )
}

export default PlaylistItems
