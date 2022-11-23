import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null,
    bottomSheetOpen: false,
    selectedOrigins: [],
    selectedDestinations: [],
    activeMode: 'start',
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setBottomSheetOpen: (state, action) => {
      state.bottomSheetOpen = action.payload;
    },
    setSelectedOrigins: (state, action) => {
      state.selectedOrigins = action.payload;
    },
    setSelectedDestinations: (state, action) => {
      state.selectedDestinations = action.payload;
    },
    setActiveMode: (state, action) => {
      state.activeMode = action.payload;
    },
  },
});

export default slice.reducer;

export const setError = (payload) => ({ type: 'app/setError', payload });
export const setBottomSheetOpen = (payload) => ({
  type: 'app/setBottomSheetOpen',
  payload,
});
export const setSelectedOrigins = (payload) => ({
  type: 'app/setSelectedOrigins',
  payload,
});
export const setSelectedDestinations = (payload) => ({
  type: 'app/setSelectedDestinations',
  payload,
});
export const setActiveMode = (payload) => ({
  type: 'app/setActiveMode',
  payload,
});
