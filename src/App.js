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
import { media } from './lib/utils/index'
import { useMediaQuery } from 'react-responsive'
import Header from './components/Header'

const GridContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 100%;

  ${media.mobile`grid-template-columns: 1fr; grid-template-rows: 1fr auto;`}
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

  const { playlistId, videoId, isPlayed, type } = video

  const { isLoggedIn } = useSelector((state) => state.user)

  const isHeader = useMediaQuery({ query: '(max-width: 500px)' })

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
          {isHeader ? <Header /> : <Sidebar />}
          <Page played={isPlayed}>
            <Switch>
              {!isLoggedIn && (
                <Route
                  path={['/', '/search', '/playlist/:playlistId']}
                  render={() => <NoLogin />}
                  exact
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
                exact
                render={(routeProps) => (
                  <Search {...routeProps} onClick={onClick} />
                )}
              />
              <Route
                path="/playlist/:playlistId"
                exact
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
