import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  getNotices,
  getCategories,
  getSexOptions,
  getSpecies,
  addToFavorites,
  removeFromFavorites,
} from '../../services/noticesService';
import type { Notice } from '../../types/notices';
import type { NoticesParams } from '../../services/noticesService';

export const fetchNotices = createAsyncThunk(
  'notices/fetchNotices',
  async (params: NoticesParams, { rejectWithValue }) => {
    try {
      return await getNotices(params);
    } catch {
      return rejectWithValue('Failed to load notices');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'notices/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch {
      return rejectWithValue('Failed to load categories');
    }
  }
);

export const fetchSexOptions = createAsyncThunk(
  'notices/fetchSexOptions',
  async (_, { rejectWithValue }) => {
    try {
      return await getSexOptions();
    } catch {
      return rejectWithValue('Failed to load sex options');
    }
  }
);

export const fetchSpecies = createAsyncThunk(
  'notices/fetchSpecies',
  async (_, { rejectWithValue }) => {
    try {
      return await getSpecies();
    } catch {
      return rejectWithValue('Failed to load species');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'notices/toggleFavorite',
  async ({ id, isFavorite }: { id: string; isFavorite: boolean }, { rejectWithValue }) => {
    try {
      if (isFavorite) {
        await removeFromFavorites(id);
      } else {
        await addToFavorites(id);
      }
      return { id, isFavorite };
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (!isFavorite && status === 409) {
        return { id, isFavorite: false };
      }
      return rejectWithValue('Failed to update favorites');
    }
  }
);

interface NoticesFilters {
  keyword: string;
  category: string;
  sex: string;
  species: string;
  sortBy: string;
  location: string;
}

interface NoticesState {
  items: Notice[];
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  categories: string[];
  sexOptions: string[];
  speciesList: string[];
  filters: NoticesFilters;
  page: number;
  favoriteIds: string[];
}

const initialFilters: NoticesFilters = {
  keyword: '',
  category: '',
  sex: '',
  species: '',
  sortBy: '',
  location: '',
};

const initialState: NoticesState = {
  items: [],
  totalPages: 1,
  isLoading: false,
  error: null,
  categories: [],
  sexOptions: [],
  speciesList: [],
  filters: initialFilters,
  page: 1,
  favoriteIds: [],
};

const noticesSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<{ key: keyof NoticesFilters; value: string }>
    ) {
      state.filters[action.payload.key] = action.payload.value;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.page = 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotices.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.results;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNotices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(fetchSexOptions.fulfilled, (state, action) => {
        state.sexOptions = action.payload;
      })
      .addCase(fetchSpecies.fulfilled, (state, action) => {
        state.speciesList = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { id, isFavorite } = action.payload;
        if (isFavorite) {
          state.favoriteIds = state.favoriteIds.filter(fId => fId !== id);
        } else {
          state.favoriteIds.push(id);
        }
      });
  },
});

export const { setFilter, setPage, resetFilters } = noticesSlice.actions;
export default noticesSlice.reducer;

export const selectNotices = (state: { notices: NoticesState }) => state.notices.items;
export const selectTotalPages = (state: { notices: NoticesState }) => state.notices.totalPages;
export const selectNoticesLoading = (state: { notices: NoticesState }) => state.notices.isLoading;
export const selectFilters = (state: { notices: NoticesState }) => state.notices.filters;
export const selectPage = (state: { notices: NoticesState }) => state.notices.page;
export const selectCategories = (state: { notices: NoticesState }) => state.notices.categories;
export const selectSexOptions = (state: { notices: NoticesState }) => state.notices.sexOptions;
export const selectSpeciesList = (state: { notices: NoticesState }) => state.notices.speciesList;
export const selectFavoriteIds = (state: { notices: NoticesState }) => state.notices.favoriteIds;
