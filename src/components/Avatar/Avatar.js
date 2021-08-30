import styled from 'styled-components'

const StyledAvatar = styled.img`
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  margin-right: 15px;
  background: rgb(210, 210, 210);
  object-fit: cover;
`

const Avatar = ({ ...rest }) => {
  return <StyledAvatar {...rest} />
}

export default Avatar
