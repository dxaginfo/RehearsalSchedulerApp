import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Rehearsal {
  id: string;
  bandId: string;
  venueId?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
  };
  createdBy: string;
  venue?: {
    id: string;
    name: string;
    address?: string;
  };
}

interface Attendance {
  id: string;
  rehearsalId: string;
  userId: string;
  status: 'confirmed' | 'declined' | 'tentative' | 'no_response';
  checkInTime?: string;
  absenceReason?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

interface RehearsalState {
  rehearsals: Rehearsal[];
  currentRehearsal: Rehearsal | null;
  attendees: Attendance[];
  loading: boolean;
  error: string | null;
}

const initialState: RehearsalState = {
  rehearsals: [],
  currentRehearsal: null,
  attendees: [],
  loading: false,
  error: null,
};

export const fetchBandRehearsals = createAsyncThunk(
  'rehearsals/fetchBandRehearsals',
  async (bandId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/bands/${bandId}/rehearsals`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsals');
    }
  }
);

export const fetchRehearsalById = createAsyncThunk(
  'rehearsals/fetchRehearsalById',
  async (rehearsalId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/rehearsals/${rehearsalId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsal');
    }
  }
);

export const createRehearsal = createAsyncThunk(
  'rehearsals/createRehearsal',
  async (rehearsalData: Partial<Rehearsal>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/rehearsals', rehearsalData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rehearsal');
    }
  }
);

export const fetchRehearsalAttendance = createAsyncThunk(
  'rehearsals/fetchRehearsalAttendance',
  async (rehearsalId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/rehearsals/${rehearsalId}/attendance`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const updateAttendanceStatus = createAsyncThunk(
  'rehearsals/updateAttendanceStatus',
  async (
    { rehearsalId, status, absenceReason }: { rehearsalId: string; status: string; absenceReason?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`/api/rehearsals/${rehearsalId}/attendance`, {
        status,
        absenceReason,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance status');
    }
  }
);

const rehearsalSlice = createSlice({
  name: 'rehearsals',
  initialState,
  reducers: {
    clearRehearsalError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch band rehearsals
    builder.addCase(fetchBandRehearsals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchBandRehearsals.fulfilled, (state, action: PayloadAction<Rehearsal[]>) => {
      state.loading = false;
      state.rehearsals = action.payload;
    });
    builder.addCase(fetchBandRehearsals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch rehearsal by ID
    builder.addCase(fetchRehearsalById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRehearsalById.fulfilled, (state, action: PayloadAction<Rehearsal>) => {
      state.loading = false;
      state.currentRehearsal = action.payload;
    });
    builder.addCase(fetchRehearsalById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create rehearsal
    builder.addCase(createRehearsal.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRehearsal.fulfilled, (state, action: PayloadAction<Rehearsal>) => {
      state.loading = false;
      state.rehearsals.push(action.payload);
      state.currentRehearsal = action.payload;
    });
    builder.addCase(createRehearsal.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch rehearsal attendance
    builder.addCase(fetchRehearsalAttendance.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRehearsalAttendance.fulfilled, (state, action: PayloadAction<Attendance[]>) => {
      state.loading = false;
      state.attendees = action.payload;
    });
    builder.addCase(fetchRehearsalAttendance.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update attendance status
    builder.addCase(updateAttendanceStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateAttendanceStatus.fulfilled, (state, action: PayloadAction<Attendance>) => {
      state.loading = false;
      const index = state.attendees.findIndex((attendee) => attendee.id === action.payload.id);
      if (index !== -1) {
        state.attendees[index] = action.payload;
      } else {
        state.attendees.push(action.payload);
      }
    });
    builder.addCase(updateAttendanceStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearRehearsalError } = rehearsalSlice.actions;
export default rehearsalSlice.reducer;