import styled from 'styled-components'
import YouTube from 'react-youtube'

const Video = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: calc(100% - var(--sidebar-width));
  height: calc(100vh - var(--player-bar-height));
  padding: 2.875rem 3.5rem 0;
  background: rgb(10, 10, 10);
  transform: ${(props) =>
    props.show ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100vh, 0)'};
  transition: transform 0.3s;
  z-index: 10;
  & > div:first-child {
    flex: 1;
    height: 100%;
    margin-bottom: 2.5rem;
    > iframe {
      width: 100%;
      height: 100%;
    }
  }

  & > div:last-child {
    margin-left: 3.5rem;
    max-width: 800px;
    width: 36%;
  }
`

const YtVideo = ({
  videoId,
  onReady,
  onStateChange,
  onError,
  show,
  type,
  loop,
  playlistItemsId,
}) => {
  return (
    <Video show={show}>
      <YouTube
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
        opts={{
          playerVars: {
            controls: 0,
            autoplay: 1,
            loop,
            ...(!loop && type === 'playlist'
              ? {
                  playlist: playlistItemsId.join(),
                }
              : { playlist: videoId }),
          },
        }}
      />
      <div></div>
    </Video>
  )
}

export default YtVideo
