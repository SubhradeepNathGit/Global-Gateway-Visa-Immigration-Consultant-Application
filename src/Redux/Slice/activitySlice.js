import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// ADD activity
export const addActivity = createAsyncThunk("activitySlice/addActivity",
    async (activity_obj, { rejectWithValue }) => {
        // console.log('Application details', activity_obj);

        try {
            const res = await supabase.from("activity").upsert(activity_obj, {
                onConflict: "application_id",
                ignoreDuplicates: false,
            }).select().single();
            // console.log('Response for adding activity', res);

            if (res.error) return rejectWithValue(res.error.message);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// FETCH Latest 4 activities
export const fetchLatestActivities = createAsyncThunk("activitySlice/fetchLatestActivities",
    async (_,{ rejectWithValue }) => {
        try {
            const res = await supabase.from("activity").select("*").order("created_at", { ascending: false }).limit(4);
            // console.log('Response for fetching activity', res);

            if (res.error) return rejectWithValue(res.error);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    activities: [],
    isActivityLoading: false,
    activityErrorMessage: "",
}

export const activitySlice = createSlice({
    name: "activitySlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add Activity
            .addCase(addActivity.pending, (state) => {
                state.isActivityLoading = true;
            })
            .addCase(addActivity.fulfilled, (state, action) => {
                state.isActivityLoading = false;
                state.activities.unshift(action.payload); // add to top
            })
            .addCase(addActivity.rejected, (state, action) => {
                state.isActivityLoading = false;
                state.activityErrorMessage = action.payload;
            })

            // Fetch Latest Activities
            .addCase(fetchLatestActivities.pending, (state) => {
                state.isActivityLoading = true;
            })
            .addCase(fetchLatestActivities.fulfilled, (state, action) => {
                state.isActivityLoading = false;
                state.activities = action.payload;
            })
            .addCase(fetchLatestActivities.rejected, (state, action) => {
                state.isActivityLoading = false;
                state.activityErrorMessage = action.payload;
            });
    },
});

export default activitySlice.reducer;