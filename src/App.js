import { useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import GlobalStyle from './components/GlobalStyle'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Search from './pages/Search'
import Playlist from './pages/Playlist'
import Player from './components/Player'
import NoLogin from './components/NoLogin'
import { useSelector } from 'react-redux'

const GridContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: var(--sidebar-width) auto;
  grid-template-rows: 100vh;
`

const Page = styled.div`
  padding-bottom: ${(props) => props.played && 'var(--player-bar-height)'};
  overflow-y: scroll;
`

const App = () => {
  const [playlistItemsId, setPlaylistItemsId] = useState([])
  const [video, setVideo] = useState({
    videoId: null,
    playlistId: null,
    isPlayed: false,
    type: 'video',
  })

  const [playlists, setPlaylists] = useState([])

  const { playlistId, videoId, isPlayed, type } = video

  const { isLoggedIn } = useSelector((state) => state.user)

  const onClick = (e) => {
    setVideo({
      videoId: e.currentTarget.dataset.videoid,
      isPlayed: true,
      type: 'video',
    })
  }

  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <GridContainer>
          <Sidebar playlists={playlists} setPlaylists={setPlaylists} />
          <Page played={isPlayed}>
            <Switch>
              {!isLoggedIn && (
                <Route
                  path={['/', '/search', '/playlist/:playlistId']}
                  render={() => <NoLogin />}
                />
              )}
              <Route
                path="/"
                render={(routeProps) => (
                  <Home {...routeProps} onClick={onClick} />
                )}
                exact
              />
              <Route
                path="/search"
                render={(routeProps) => (
                  <Search {...routeProps} onClick={onClick} />
                )}
              />
              <Route
                path="/playlist/:playlistId"
                render={(routeProps) => (
                  <Playlist
                    {...routeProps}
                    setVideo={setVideo}
                    setPlaylistItemsId={setPlaylistItemsId}
                  />
                )}
              />

              <Route
                path="*"
                render={({ history }) => {
                  alert('이 페이지는 존재하지 않는 페이지입니다.')
                  history.push('/')
                }}
              />
            </Switch>
            {isPlayed && (
              <Player
                type={type}
                videoId={videoId}
                playlistId={playlistId}
                playlistItemsId={playlistItemsId}
              />
            )}
          </Page>
        </GridContainer>
      </BrowserRouter>
    </>
  )
}

export default App
