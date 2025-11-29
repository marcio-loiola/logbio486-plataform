import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LogbookEntry {
  id: string;
  vessel_name: string;
  entry_date: string;
  velocity: number;
  fuel_consumption: number;
  route: string;
  distance_traveled?: number | null;
  water_temperature?: number | null;
  salinity?: number | null;
  observations?: string | null;
  biofouling_level?: string | null;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

interface LogbookState {
  entries: LogbookEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: LogbookState = {
  entries: [],
  loading: false,
  error: null,
};

const logbookSlice = createSlice({
  name: 'logbook',
  initialState,
  reducers: {
    setEntries: (state, action: PayloadAction<LogbookEntry[]>) => {
      state.entries = action.payload;
    },
    addEntry: (state, action: PayloadAction<LogbookEntry>) => {
      state.entries.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setEntries, addEntry, setLoading, setError } = logbookSlice.actions;
export default logbookSlice.reducer;
