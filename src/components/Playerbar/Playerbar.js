import React from 'react'
import styled from 'styled-components'
import { media } from '../../lib/utils/index'
import Icon from '../Icon/Icon'

const CircleContainer = styled.div`
  position: absolute;
  top: 0;
  left: ${(props) => props.left}%;
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 100%;
  transform: translateX(-50%);
`

const ProgressContainer = styled.div`
  position: relative;
  height: 2px;
`

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: calc(100% - var(--sidebar-width));
  height: var(--player-bar-height);
  padding: 0 1rem;
  background-color: var(--player-bg);
  backdrop-filter: saturate(50%) blur(20px);
  color: var(--system-primary);
  z-index: 100;
  &:hover ${CircleContainer} {
    display: flex;
  }

  &:hover ${ProgressContainer} {
    height: 4px;
  }

  & > div:first-child {
    ${media.mobile`display: none;`}
  }

  ${media.mobile`width: 100%; `}
`

const ControlItem = styled.div`
  display: flex;
  align-items: center;
  height: 100%;

  &:nth-child(2) > div:nth-child(4) {
    @media (max-width: 1040px) {
      display: none;
    }
  }
`

const SvgContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  margin: ${(props) => (props.margin ? props.margin : '0 0.5rem 0 0')};
  fill: var(--theme-color);
`

const SvgStyle = {
  display: 'block',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
}

const TimeInfo = styled.span`
  font-size: 0.75rem;
  color: #aaa;

  @media (max-width: 1040px) {
    display: none;
  }
`

const HoverTimeInfo = styled.div`
  position: absolute;
  top: -30px;
  left: ${(props) => props.left}px;
  padding: 0.25rem 0.5rem;
  background: rgb(33, 33, 33);
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #fff;
`

const VideoInfoContainer = styled.div`
  display: flex;
  align-items: center;
`

const ChannelTitle = styled.span``

const VideoThumbnail = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: rgb(66, 66, 66);
  border-radius: 2px;
`

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
`

const VideoInfo = styled.div`
  margin-left: 1rem;
`

const Title = styled.a`
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 0.8125rem;
  color: var(--player-title-color);
  white-space: nowrap;
`

const Info = styled.div`
  color: var(--player-desc-color);
  font-size: 0.8125rem;
`

const Year = styled.span``

const ProgressPadding = styled.div`
  padding: 1rem 0;
`

const Progress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateY(-50%);
  cursor: pointer;
`

const ProgressBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(144, 144, 144);
  cursor: pointer;
`

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  background-color: #f00;
  width: ${(props) => props.progress}%;
`

const SliderBar = styled.div`
  position: relative;
  width: 64px;
  cursor: pointer;
  user-select: none;
  @media (max-width: 1040px) {
    display: none;
  }
`

const SoundCircle = styled.div`
  position: absolute;
  top: 50%;
  left: ${(props) => props.left}%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border: 1px solid rgb(129, 129, 129);
  border-radius: 50%;
  user-select: none;
`

const Circle = styled.div`
  left: ${(props) => props.left}%;
  width: 14px;
  height: 14px;
  background: #f00;
  border-radius: 50%;
`

const Playerbar = ({
  toggleShowVideo,
  show,
  isMuted,
  isLoop,
  playerState,
  start,
  end,
  volume,
  onMouseDown,
  onMouseOver,
  onMouseMove,
  onMouseLeave,
  onMouseDownAtVolume,
  onMouseMoveAtVolume,
  onClickSetLoop,
  onSetShuffle,
  onPause,
  onPlay,
  onMute,
  onUnMute,
  nextVideo,
  previousVideo,
  isShuffle,
  isHover,
  hoverTime,
  hoverLeft,
  progress,
  title,
  channelTitle,
  thumbnail,
  publishedAt,
  volumeEl,
  videoProgressEl,
}) => {
  return (
    <Container>
      <ControlItem style={{ color: 'rgb(144, 144, 144)' }}>
        <SvgContainer>
          <Icon
            name="upArrow"
            style={{
              ...SvgStyle,
              transform: show ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
            onClick={toggleShowVideo}
          />
        </SvgContainer>
        <SvgContainer>
          {isLoop ? (
            <Icon
              name="oneRoop"
              style={SvgStyle}
              onClick={onClickSetLoop}
              className="oneRoop"
            />
          ) : (
            <Icon name="roop" style={SvgStyle} onClick={onClickSetLoop} />
          )}
        </SvgContainer>
        <SvgContainer>
          <Icon
            name="shupple"
            style={{ ...SvgStyle, fill: isShuffle && 'var(--red)' }}
            onClick={onSetShuffle}
          />
        </SvgContainer>
        <SvgContainer>
          {isMuted ? (
            <Icon name="unmute" style={SvgStyle} onClick={onUnMute} />
          ) : (
            <Icon name="mute" style={SvgStyle} onClick={onMute} />
          )}
        </SvgContainer>
        <SliderBar
          onMouseDown={onMouseDownAtVolume}
          onMouseMove={onMouseMoveAtVolume}
          ref={volumeEl}
        >
          <ProgressPadding>
            <ProgressContainer>
              <ProgressBg style={{ background: '#909090' }} />
              <ProgressBar
                progress={volume}
                style={{ background: 'var(--sound-progress-bg)' }}
              />
            </ProgressContainer>
          </ProgressPadding>
          <SoundCircle left={volume} />
        </SliderBar>
      </ControlItem>

      <ControlItem style={{ justifyContent: 'center' }}>
        <VideoInfoContainer>
          <VideoThumbnail>
            <Thumbnail src={thumbnail} alt={title} />
          </VideoThumbnail>
          <VideoInfo>
            <Title href="/">{title}</Title>
            <Info>
              <ChannelTitle>{channelTitle}</ChannelTitle>
              <span> • </span>
              <Year>{new Date(publishedAt).getFullYear()}</Year>
            </Info>
          </VideoInfo>
        </VideoInfoContainer>
      </ControlItem>

      <ControlItem style={{ color: '#fff', justifyContent: 'flex-end' }}>
        <TimeInfo>
          {start} / {end}
        </TimeInfo>
        <SvgContainer>
          <Icon name="prevArrow" style={SvgStyle} onClick={previousVideo} />
        </SvgContainer>

        <SvgContainer>
          {playerState === 1 ? (
            <Icon
              name="pause"
              style={{
                ...SvgStyle,
                width: '40px',
                height: '40px',
              }}
              onClick={onPause}
            />
          ) : (
            (playerState === 2 ||
              playerState === 0 ||
              playerState === undefined) && (
              <Icon
                name="play"
                style={{
                  ...SvgStyle,
                  width: '40px',
                  height: '40px',
                }}
                onClick={onPlay}
              />
            )
          )}
        </SvgContainer>

        <SvgContainer>
          <Icon name="nextArrow" style={SvgStyle} onClick={nextVideo} />
        </SvgContainer>
      </ControlItem>

      {isHover && <HoverTimeInfo left={hoverLeft}>{hoverTime}</HoverTimeInfo>}
      <Progress
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        ref={videoProgressEl}
      >
        <ProgressPadding>
          <ProgressContainer>
            <ProgressBg />
            <ProgressBar progress={progress} />
          </ProgressContainer>
        </ProgressPadding>
        <CircleContainer left={progress}>
          <Circle />
        </CircleContainer>
      </Progress>
    </Container>
  )
}

export default Playerbar
