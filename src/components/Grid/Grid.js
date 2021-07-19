import styled from 'styled-components'

import Item from '../Item'

const Container = styled.div`
  padding: 2rem 2.5rem 0;
`
const Title = styled.h2`
  font-size: 1.5rem;
`

const List = styled.ul`
  display: flex;
  margin: 1.5rem auto 0;
  flex-wrap: wrap;
  @media (max-width: 1150px) {
    & > li {
      width: calc(33.3% - 1rem);
    }
  }

  @media (max-width: 780px) {
    & > li {
      width: calc(50% - 1rem);
    }
  }

  @media (max-width: 480px) {
    & > li {
      width: calc(100% - 1rem);
    }
  }
`

const Grid = ({ items, title, onClick }) => {
  return (
    <Container>
      {items && items.length > 0 && (
        <>
          <div>
            <Title>{title}</Title>
          </div>

          <List>
            {items.map((item, idx) => (
              <Item
                key={item.id.videoId ? item.id.videoId : item.id}
                data={item}
                onClick={onClick}
                rank={idx + 1}
              />
            ))}
          </List>
        </>
      )}
    </Container>
  )
}

export default Grid
