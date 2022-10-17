import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GlobalStyle from './components/GlobalStyle';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Search from './pages/Search';
import Playlist from './pages/Playlist';
import Player from './components/Player';
import NoLogin from './components/NoLogin';
import { useSelector } from 'react-redux';
import { media } from './lib/utils/index';
import { useMediaQuery } from 'react-responsive';
import Header from './components/Header';
import Helmet from 'react-helmet';

const GridContainer = styled.div`
  display: grid;
  height: 100vh;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 100%;

  ${media.mobile`
  grid-template-columns: 1fr;
  grid-template-rows: 1fr auto;`}
`;

const Page = styled.div`
  padding-bottom: ${props => props.played && 'var(--player-bar-height)'};
  overflow-y: scroll;
`;

const App = () => {
  const [playlistItemsId, setPlaylistItemsId] = useState([]);
  const [video, setVideo] = useState({
    videoId: null,
    playlistId: null,
    isPlayed: false,
    type: 'video',
  });
  const [scrollWidth, setScrollWidth] = useState(0);
  const { playlistId, videoId, isPlayed, type } = video;

  const { isLoggedIn } = useSelector(state => state.user);

  const isHeader = useMediaQuery({ query: '(max-width: 500px)' });

  const pageRef = useRef(null);

  const onClick = e => {
    setVideo({
      videoId: e.currentTarget.dataset.videoid,
      isPlayed: true,
      type: 'video',
    });
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      setScrollWidth(pageRef.current.offsetWidth - pageRef.current.scrollWidth);
    });
  }, []);

  return (
    <>
      <BrowserRouter>
        <GlobalStyle />
        <Helmet>
          <meta charSet="utf-8" />
          <title>콘텐츠 시청 유형 테스트</title>
          <link rel="canonical" href="https://www.mbcmbti.com" />
          <meta name="robots" content="index, follow" />
          <meta property="og:url" content="https://www.mbcmbti.com" data-react-helmet="true" />
          <meta name="title" content="콘텐츠 시청 유형 테스트" data-react-helmet="true" />
          <meta
            name="description"
            content="MBTI (Media buy Type Indicator)"
            data-react-helmet="true"
          />
          <meta name="keywords" content="MBTI  콘텐츠 유형 테스트 MBC" data-react-helmet="true" />
          <meta property="og:type" content="website" data-react-helmet="true" />
          <meta property="og:title" content="콘텐츠 시청 유형 테스트" data-react-helmet="true" />
          <meta
            property="og:description"
            content="MBTI (Media buy Type Indicator)"
            data-react-helmet="true"
          />
          <meta
            property="og:image"
            content="https://i.ibb.co/zXHd1BL/og-image-png.png"
            data-react-helmet="true"
          />
          <meta property="og:image:width" content="800" data-react-helmet="true" />
          <meta property="og:image:height" content="300" data-react-helmet="true" />
          <meta name="twitter:card" content="summary_large_image" data-react-helmet="true" />
          <meta name="twitter:title" content="콘텐츠 시청 유형 테스트" data-react-helmet="true" />
          <meta
            name="twitter:description"
            content="MBTI (Media buy Type Indicator)"
            data-react-helmet="true"
          />
          <meta
            property="twitter:image"
            content="https://i.ibb.co/zXHd1BL/og-image-png.png"
            data-react-helmet="true"
          />
          <meta name="twitter:image:width" content="800" data-react-helmet="true" />
          <meta name="twitter:image:height" content="300" data-react-helmet="true" />
          <link rel="manifest" href="/meta/manifest.json" />
        </Helmet>
        <GridContainer>
          {isHeader ? <Header /> : <Sidebar />}
          <Page played={isPlayed} ref={pageRef}>
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
                render={routeProps => <Home {...routeProps} onClick={onClick} />}
                exact
              />
              <Route
                path="/search"
                exact
                render={routeProps => <Search {...routeProps} onClick={onClick} />}
              />
              <Route
                path="/playlist/:playlistId"
                exact
                render={routeProps => (
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
                  alert('이 페이지는 존재하지 않는 페이지입니다.');
                  history.push('/');
                }}
              />
            </Switch>
            {isPlayed && (
              <Player
                type={type}
                videoId={videoId}
                playlistId={playlistId}
                playlistItemsId={playlistItemsId}
                scrollWidth={scrollWidth}
              />
            )}
          </Page>
        </GridContainer>
      </BrowserRouter>
    </>
  );
};

export default App;
