import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// fetch holidays
export const fetchHolidays = createAsyncThunk("holidaysSlice/fetchHolidays",
    async (status = "all", { rejectWithValue }) => {
        try {
            let query = supabase.from("holiday").select("*");

            if (status === "active") {
                query = query.eq("status", true);
            } else if (status === "inactive") {
                query = query.eq("status", false);
            }

            const res = await query;
            // console.log('Response for fetching holidays', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// add holiday
export const addHoliday = createAsyncThunk("holidaysSlice/addHoliday",
    async (holiday, { rejectWithValue }) => {
        // console.log('Receive holiday data to add', holiday);

        try {
            const res = await supabase.from("holiday").insert([holiday]).select().single();
            // console.log('Response for adding holiday data', res);

            if (res?.error) throw res.error;
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// update holiday
export const updateHoliday = createAsyncThunk("holidaysSlice/updateHoliday",
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Receive holiday data to update of id', id, ' with data', updatedData);

        try {
            const res = await supabase.from("holiday").update(updatedData).eq("id", id).select().single();
            // console.log('Response for updating holiday data', res);

            if (res?.error) throw res.error;
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// delete holiday
export const deleteHoliday = createAsyncThunk("holidaysSlice/deleteHoliday",
    async (id, { rejectWithValue }) => {
        // console.log('Receive holiday data to delete id', id);

        try {
            const res = await supabase.from("holiday").delete().eq("id", id);
            // console.log('Response for deleting holiday data', res);

            if (res?.error) throw res.error;
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

const initialState = {
    holidayData: [],
    isHolidayLoading: false,
    holidayError: null,
}

export const holidaysSlice = createSlice({
    name: "holidaysSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // fetch holiday 
            .addCase(fetchHolidays.pending, (state) => {
                state.isHolidayLoading = true;
            })
            .addCase(fetchHolidays.fulfilled, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayData = action.payload;
            })
            .addCase(fetchHolidays.rejected, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayError = action.payload;
            })

            // add holiday 
            .addCase(addHoliday.pending, (state) => {
                state.isHolidayLoading = true;
            })
            .addCase(addHoliday.fulfilled, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayData.push(action.payload);
            })
            .addCase(addHoliday.rejected, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayError = action.payload;
            })

            // update holiday 
            .addCase(updateHoliday.pending, (state) => {
                state.isHolidayLoading = true;
            })
            .addCase(updateHoliday.fulfilled, (state, action) => {
                state.isHolidayLoading = false;
                const index = state.holidayData.findIndex(
                    h => h.id === action.payload.id
                );
                if (index !== -1) {
                    state.holidayData[index] = action.payload;
                }
            })
            .addCase(updateHoliday.rejected, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayError = action.payload;
            })

            // delete holiday 
            .addCase(deleteHoliday.pending, (state) => {
                state.isHolidayLoading = true;
            })
            .addCase(deleteHoliday.fulfilled, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayData = state.holidayData.filter(
                    h => h.id !== action.payload
                )
            })
            .addCase(deleteHoliday.rejected, (state, action) => {
                state.isHolidayLoading = false;
                state.holidayError = action.payload;
            });
    },
});

export default holidaysSlice.reducer;
