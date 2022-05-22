import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { signin } from '../features/user/userSlice';
import { auth } from '../firebaseInit';

export default function useAuth() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        const { displayName, photoURL, accessToken: access_token } = authUser;

        dispatch(
          signin({
            displayName,
            photoURL,
            access_token,
            isLoggedIn: true,
          }),
        );
      }

      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return { loading };
}
