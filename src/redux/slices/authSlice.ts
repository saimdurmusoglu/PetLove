import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../../services/api';
import { firebaseLogin, firebaseRegister, firebaseSignOut } from '../../services/firebase';

export interface Pet {
  _id: string;
  name: string;
  title: string;
  imgURL: string;
  species: string;
  birthday: string;
  sex: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  token?: string;
  pets?: Pet[];
  noticesFavorites?: Array<{ _id: string; [key: string]: unknown }>;
  noticesViewed?: Array<{ _id: string; [key: string]: unknown }>;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isRefreshing: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoggedIn: false,
  isRefreshing: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/current/full');
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await firebaseLogin(credentials.email, credentials.password);
      const { data } = await api.post('/users/signin', credentials);
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(e.response?.data?.message || e.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (credentials: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      await firebaseRegister(credentials.email, credentials.password);
      const { data } = await api.post('/users/signup', credentials);
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(e.response?.data?.message || e.message || 'Registration failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: { name?: string; email?: string; phone?: string; avatar?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch('/users/current/edit', userData);
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Update failed');
    }
  }
);

export const removePet = createAsyncThunk(
  'auth/removePet',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/users/current/pets/remove/${id}`);
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Failed');
    }
  }
);

export const addPet = createAsyncThunk(
  'auth/addPet',
  async (
    pet: { name: string; title: string; imgURL: string; species: string; birthday: string; sex: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/users/current/pets/add', pet);
      return data;
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Failed to add pet');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await firebaseSignOut();
      await api.post('/users/signout');
    } catch (error) {
      const e = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(e.response?.data?.message || 'Failed');
    }
  }
);

const clearAuth = (state: AuthState) => {
  state.user = null;
  state.token = null;
  state.isLoggedIn = false;
  state.error = null;
  localStorage.removeItem('token');
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isLoggedIn = true;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(fetchCurrentUser.rejected, state => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.token = null;
        state.isLoggedIn = false;
        localStorage.removeItem('token');
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(removePet.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(addPet.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signOut.fulfilled, state => {
        clearAuth(state);
      })
      .addCase(signOut.rejected, state => {
        clearAuth(state);
      });
  },
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
      clearAuth(state);
    },
  },
});

export const { setUser, setToken, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsRefreshing = (state: { auth: AuthState }) => state.auth.isRefreshing;