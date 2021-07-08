import styled from 'styled-components'
import Icon from '../Icon'

const ListItem = styled.li`
  width: calc(25% - 1rem);
  margin: 0 0.5rem 2.5rem;
`

const Content = styled.div`
  display: flex;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
`

const ImgContainer = styled.div`
  cursor: pointer;
`

const Title = styled.h3`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  flex: 1;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 20px;
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--system-primary);
`

const Img = styled.img`
  width: 100%;
  max-height: 180px;
  object-fit: cover;
`

const Rank = styled.div`
  display: flex;
  color: var(--system-secondary);
  margin-right: 0.5rem;
`

const Seperator = styled.span`
  margin-left: 0.5rem;
`

const Item = ({
  onClick,
  rank,
  data: {
    id,
    id: { videoId },
    snippet: {
      title,
      thumbnails: {
        medium: { url },
      },
    },
  },
}) => {
  return (
    <ListItem onClick={onClick} data-videoid={videoId || id}>
      <ImgContainer>
        <Img src={url} alt={title} />
      </ImgContainer>
      <Content>
        <Rank>
          <span>{rank}</span>
          <Seperator>-</Seperator>
        </Rank>
        <Title dangerouslySetInnerHTML={{ __html: title }} />
        <Icon
          name="playlist"
          style={{
            width: '24px',
            height: '24px',
            fill: 'var(--system-primary)',
            marginLeft: 'auto',
            cursor: 'pointer',
          }}
        />
      </Content>
    </ListItem>
  )
}

export default Item
