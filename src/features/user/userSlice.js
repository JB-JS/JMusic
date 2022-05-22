import { createSlice } from '@reduxjs/toolkit';
import { auth } from '../../firebaseInit';

const initialState = {
  displayName: null,
  photoURL: null,
  access_token: null,
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    signin: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    signOut: state => {
      auth.signOut();

      return initialState;
    },
  },
});

export const { signin, signOut } = userSlice.actions;

export default userSlice.reducer;
