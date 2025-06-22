import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Band {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
}

interface BandMember {
  id: string;
  bandId: string;
  userId: string;
  role: 'leader' | 'member' | 'admin';
  joinedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface BandState {
  bands: Band[];
  currentBand: Band | null;
  members: BandMember[];
  loading: boolean;
  error: string | null;
}

const initialState: BandState = {
  bands: [],
  currentBand: null,
  members: [],
  loading: false,
  error: null,
};

export const fetchUserBands = createAsyncThunk('bands/fetchUserBands', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/bands');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch bands');
  }
});

export const fetchBandById = createAsyncThunk(
  'bands/fetchBandById',
  async (bandId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bands/${bandId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch band');
    }
  }
);

export const createBand = createAsyncThunk(
  'bands/createBand',
  async (bandData: { name: string; description?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bands', bandData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create band');
    }
  }
);

export const fetchBandMembers = createAsyncThunk(
  'bands/fetchBandMembers',
  async (bandId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bands/${bandId}/members`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch band members');
    }
  }
);

const bandSlice = createSlice({
  name: 'bands',
  initialState,
  reducers: {
    clearBandError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user bands
    builder.addCase(fetchUserBands.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserBands.fulfilled, (state, action: PayloadAction<Band[]>) => {
      state.loading = false;
      state.bands = action.payload;
    });
    builder.addCase(fetchUserBands.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch band by ID
    builder.addCase(fetchBandById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBandById.fulfilled, (state, action: PayloadAction<Band>) => {
      state.loading = false;
      state.currentBand = action.payload;
    });
    builder.addCase(fetchBandById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create band
    builder.addCase(createBand.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBand.fulfilled, (state, action: PayloadAction<Band>) => {
      state.loading = false;
      state.bands.push(action.payload);
      state.currentBand = action.payload;
    });
    builder.addCase(createBand.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch band members
    builder.addCase(fetchBandMembers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBandMembers.fulfilled, (state, action: PayloadAction<BandMember[]>) => {
      state.loading = false;
      state.members = action.payload;
    });
    builder.addCase(fetchBandMembers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearBandError } = bandSlice.actions;
export default bandSlice.reducer;