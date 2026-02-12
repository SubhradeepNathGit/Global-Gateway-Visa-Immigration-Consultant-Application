import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import supabase from '../../util/Supabase/supabase';

// fetch embassy timing by embassy id
export const fetchEmbassyTiming = createAsyncThunk('timingSlice/fetchEmbassyTiming',
    async (embassyId) => {
        // console.log('Fetch timing for embassy', embassyId);

        const res = await supabase.from('embassy').select('starting_hours, ending_hours').eq('id', embassyId).single();

        // console.log('Response for fetching timing', res);

        if (res?.error) throw res?.error;
        return res?.data;
    }
);

const initialState = {
    timingStarting_hours: null,
    timingEnding_hours: null,
    timingLoading: false,
    timingError: null
}

export const timingSlice = createSlice({
    name: 'timingSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // fetch embassy timing by embassy id
            .addCase(fetchEmbassyTiming.pending, (state) => {
                state.timingLoading = true;
            })
            .addCase(fetchEmbassyTiming.fulfilled, (state, action) => {
                state.timingLoading = false;
                state.timingStarting_hours = action.payload.starting_hours;
                state.timingEnding_hours = action.payload.ending_hours;
            })
            .addCase(fetchEmbassyTiming.rejected, (state, action) => {
                state.timingLoading = false;
                state.timingError = action.error.message;
            })
    },
});

export default timingSlice.reducer;