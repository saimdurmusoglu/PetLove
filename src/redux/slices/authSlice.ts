import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  phone: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
      state.error = null;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } =
  authSlice.actions;
export default authSlice.reducer;