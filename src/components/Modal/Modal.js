import React from 'react'
import styled from 'styled-components'

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  max-width: 680px;
  width: 100%;
  border: 1px solid rgb(255, 255, 255, 0.2);
  background: rgb(33, 33, 33);
  transform: translate(-50%, -50%);
  font-family: 'Roboto', sans-serif;
  z-index: 102;

  @media (max-width: 680px) {
    width: calc(100% - 40px);
  }
`

const BackColor = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 101;
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
