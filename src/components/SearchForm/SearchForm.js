import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import Icon from '../Icon/Icon'

const Form = styled.form`
  position: relative;
  margin-top: 1.25rem;
  padding: 0 1.5625rem;
`

const Input = styled.input`
  width: 100%;
  height: 32px;
  border-radius: 4px;
  padding-left: 2rem;
  border: 1px solid var(--searchbox-border-color);
  background: var(--searchbox-background);
  color: var(--searchbox-text-color);

  &:focus {
    border: 1px solid rgba(var(--primary-color-rgb), 0.6);
  }
`

const SearchForm = () => {
  const history = useHistory()
  const [term, setTerm] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    history.push(`/search?keyword=${term}`)
  }

  const onChange = (e) => {
    setTerm(e.target.value)
  }

  const onKeyDown = (e) => {
    e.stopPropagation()
  }

  return (
    <Form onSubmit={onSubmit}>
      <Icon
        name="search"
        style={{
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '10px',
          marginRight: '5px',
          fill: 'var(--searchbox-icon-fill)',
          width: '12px',
          height: '12px',
        }}
      />
      <Input
        placeholder="음악을 검색하세요"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={term}
      ></Input>
    </Form>
  )
}

export default SearchForm
