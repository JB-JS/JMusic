import { useState, useCallback } from 'react'
import AddPlaylistModal from '../AddPlaylistModal'
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
  const [isModal, setIsModal] = useState(false)
  const [geometry, setGeometry] = useState({
    x: 0,
    y: 0,
  })

  const onShowModal = (e) => {
    const x = e.screenX + parseInt(e.currentTarget.style.width, 10)
    const y = e.pageY + parseInt(e.currentTarget.style.height, 10)

    if (x + 320 > document.documentElement.width) {
    }

    if (y + 480 > document.documentElement.height) {
    }

    setGeometry({ x, y })
    setIsModal(true)
  }

  const onHideModal = useCallback(() => {
    setIsModal(false)
  }, [setIsModal])

  return (
    <Container>
      {items && items.length > 0 && (
        <>
          <div>
            <Title>{title}</Title>
          </div>
          {isModal && (
            <AddPlaylistModal onHideModal={onHideModal} geometry={geometry} />
          )}
          <List>
            {items.map((item, idx) => (
              <Item
                key={item.id.videoId ? item.id.videoId : item.id}
                data={item}
                onClick={onClick}
                onShowModal={onShowModal}
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
