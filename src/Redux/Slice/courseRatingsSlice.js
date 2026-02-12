import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// Add a rating
export const addCourseRating = createAsyncThunk("courseRatingsSlice/addCourseRating",
    async (rating_obj, { rejectWithValue }) => {
        // console.log('Received data for adding rating in slice', rating_obj);
        try {
            const res = await supabase.from("course_ratings").insert(rating_obj).select().single();;
            // console.log('Response for adding rating', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch all ratings for a user
export const fetchUserRatings = createAsyncThunk("courseRatingsSlice/fetchUserRatings",
    async (userId, { rejectWithValue }) => {
        console.log('Received data for fetching user wise rating in slice', userId);

        try {
            const res = await supabase.from("course_ratings").select("*").eq("user_id", userId);
            console.log('Response for fetching user wise rating', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch all ratings for a course
export const fetchCourseRatings = createAsyncThunk("courseRatingsSlice/fetchCourseRatings",
    async (courseId, { rejectWithValue }) => {
        // console.log('Received data for fetching course wise rating in slice', courseId);

        try {
            const res = await supabase.from("course_ratings").select("*").eq("course_id", courseId);
            console.log('Response for fetching course wise rating', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    allRatings: [],
    specificRating:[],
    isRatingLoading: false,
    hasRatingerror: null,
};

export const courseRatingsSlice = createSlice({
    name: "courseRatingsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Add rating
            .addCase(addCourseRating.pending, (state) => {
                state.isRatingLoading = true;
            })
            .addCase(addCourseRating.fulfilled, (state, action) => {
                state.isRatingLoading = false;
                const existingIndex = state.allRatings.findIndex(
                    (r) => r.course_id === action.payload.course_id
                );
                if (existingIndex >= 0) {
                    state.allRatings[existingIndex] = action.payload;
                } else {
                    state.allRatings.push(action.payload);
                }
            })
            .addCase(addCourseRating.rejected, (state, action) => {
                state.isRatingLoading = false;
                state.hasRatingerror = action.payload;
            })

            // Fetch user ratings
            .addCase(fetchUserRatings.pending, (state) => {
                state.isRatingLoading = true;
            })
            .addCase(fetchUserRatings.fulfilled, (state, action) => {
                state.isRatingLoading = false;
                state.allRatings = action.payload;
            })
            .addCase(fetchUserRatings.rejected, (state, action) => {
                state.isRatingLoading = false;
                state.hasRatingerror = action.payload;
            })

            // Fetch course ratings
            .addCase(fetchCourseRatings.pending, (state) => {
                state.isRatingLoading = true;
            })
            .addCase(fetchCourseRatings.fulfilled, (state, action) => {
                state.isRatingLoading = false;
                state.specificRating = action.payload;
            })
            .addCase(fetchCourseRatings.rejected, (state, action) => {
                state.isRatingLoading = false;
                state.hasRatingerror = action.payload;
            });
    },
});

export default courseRatingsSlice.reducer;
