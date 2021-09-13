import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: fixed;
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  max-width: 350px;
  min-width: 185px;
  background: var(--contextmenu-bg);
  backdrop-filter: blur(70px) saturate(210%);
  border: 1px solid rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2),
    0 8px 40px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  color: var(--system-primary);
  font-size: 13px;
  transform: ${(props) => props.overX && 'translate(-100%)'};
  z-index: 9991;
`

const OutsideArea = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9990;
  cursor: pointer;
`

const Contextmenu = React.forwardRef(
  (
    { children, location: { x, y }, over: { overX }, setIsContextMenu },
    ref
  ) => {
    return (
      <>
        <Container top={y} left={x} ref={ref} overX={overX}>
          {children}
        </Container>
        <OutsideArea onClick={() => setIsContextMenu(false)} />
      </>
    )
  }
)

export default Contextmenu
