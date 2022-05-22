import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { signin } from '../../features/user/userSlice';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import Icon from '../Icon';
import { auth } from '../../firebaseInit';

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
`;

const SigninBtn = ({ width = '100%' }) => {
  const dispatch = useDispatch();

  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/youtube.force-ssl');

    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        console.log(token, result);

        // The signed-in user info.
        const { displayName, photoURL } = result.user;
        // ...

        dispatch(
          signin({
            displayName,
            photoURL,
            access_token: token,
            isLoggedIn: true,
          }),
        );
      })
      .catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }, [dispatch]);

  return (
    <Signin width={width} onClick={signInWithGoogle}>
      <Icon name="google" />
      <span>Sign in With Google</span>
    </Signin>
  );
};

export default SigninBtn;
