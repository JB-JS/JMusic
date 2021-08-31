import React from 'react'
import styled from 'styled-components'

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: 704px;
  background: rgb(33, 33, 33);
  transform: translate(-50%, -50%);
  z-index: 10;
`

const BackColor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
`

const Modal = ({ children }) => {
  return (
    <>
      <StyledModal>{children}</StyledModal>
      <BackColor />
    </>
  )
}

export default Modal
