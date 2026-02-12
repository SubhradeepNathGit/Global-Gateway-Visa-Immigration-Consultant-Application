import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
  loadingMessage: '',
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading: (state, action) => {
      state.isLoading = true;
      state.loadingMessage = action.payload || '';
    },
    stopLoading: (state) => {
      state.isLoading = false;
      state.loadingMessage = '';
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
