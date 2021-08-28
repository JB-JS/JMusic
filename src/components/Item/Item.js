import styled from 'styled-components'
import Icon from '../Icon'

const ListItem = styled.li`
  position: relative;
  width: calc(25% - 1rem);
  margin: 0 0.5rem 2.5rem;
  cursor: pointer;
`

const Content = styled.div`
  display: flex;
  margin-top: 0.75rem;
  margin-bottom: 0.25rem;
  margin: 0.75rem 2rem 0.25rem 0;
`

const ImgContainer = styled.div``

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
  onShowModal,
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
    <ListItem>
      <ImgContainer onClick={onClick} data-videoid={videoId || id}>
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
          onClick={onShowModal}
          style={{
            position: 'absolute',
            right: '0',
            width: '24px',
            height: '24px',
            fill: 'var(--system-primary)',
            marginLeft: 'auto',

            zIndex: 2,
          }}
        />
      </Content>
    </ListItem>
  )
}

export default Item
