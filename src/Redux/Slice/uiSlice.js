import { createSlice } from '@reduxjs/toolkit';

/**
 * uiSlice — stores transient UI state (e.g. current pagination page)
 * that should survive tab/route switches but doesn't need to be persisted
 * to the backend.
 *
 * Structure:
 *   pages: { [pageKey: string]: number }
 *
 * Each page that has a paginated table registers its own key (e.g.
 * "viewApplications", "manageCountry") so they don't interfere with each
 * other.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    pages: {},
  },
  reducers: {
    setPage: (state, action) => {
      const { key, page } = action.payload;
      state.pages[key] = page;
    },
    resetPage: (state, action) => {
      const { key } = action.payload;
      state.pages[key] = 1;
    },
  },
});

export const { setPage, resetPage } = uiSlice.actions;

/** Selector — returns 1 if no page has been set for this key yet */
export const selectPage = (key) => (state) => state.ui.pages[key] ?? 1;

export default uiSlice.reducer;
