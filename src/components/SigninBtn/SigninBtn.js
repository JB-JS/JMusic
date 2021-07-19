import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'
import { signin } from '../../features/user/userSlice'
import Icon from '../Icon'

const Signin = styled.div`
  display: inline-flex;
  align-items: center;
  width: ${({ width }) => width};
  padding: 0.75rem 1rem;
  background: var(--system-primary);
  color: var(--googleBtn-color);
  border-radius: 6px;
  font-size: 0.8125rem;
  cursor: pointer;
  > svg {
    margin-right: 0.625rem;
  }
`

const SigninBtn = ({ width = '100%' }) => {
  const buttonRef = useRef(null)

  const dispatch = useDispatch()

  useEffect(() => {
    window.gapi.load('auth2', function () {
      const googleAuth = window.gapi.auth2.init({
        client_id:
          '612653883280-agd5lm8n0qum7eh5fj27cmvt0hhkq2hq.apps.googleusercontent.com',
      })

      googleAuth.attachClickHandler(
        buttonRef.current,
        {
          scope: 'https://www.googleapis.com/auth/youtube',
        },
        (e) => {
          const basicProfile = e.getBasicProfile()
          const displayName = basicProfile.getName()
          const photoURL = basicProfile.getImageUrl()
          const isLoggedIn = e.isSignedIn()
          const access_token = e.getAuthResponse().access_token

          dispatch(
            signin({
              auth: googleAuth.signOut,
              displayName,
              photoURL,
              isLoggedIn,
              access_token,
            })
          )
        }
      )
    })
  }, [dispatch])

  return (
    <Signin ref={buttonRef} width={width}>
      <Icon name="google" />
      <span>Sign in With Google</span>
    </Signin>
  )
}

export default SigninBtn
