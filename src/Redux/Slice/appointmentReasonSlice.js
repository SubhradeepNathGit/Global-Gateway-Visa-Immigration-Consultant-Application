import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";


// fetch appointment
export const fetchAppointmentReasons = createAsyncThunk("appointmentReasonSlice/fetchAppointmentReasons",
    async (status = "all", { rejectWithValue }) => {
        try {
            let query = supabase.from("appointment_reason").select("*").order("created_at", { ascending: false });

            // status filter
            if (status === "active") query = query.eq("status", true);
            if (status === "inactive") query = query.eq("status", false);

            const res = await query;
            // console.log('Response for fetching active reasons', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// add appointment
export const addAppointmentReason = createAsyncThunk("appointmentReasonSlice/addAppointmentReason",
    async ({ newTitleData }, { rejectWithValue }) => {
        // console.log('Recived data for adding appointment reason', id, updatedData);

        try {
            const res = await supabase.from("appointment_reason").insert([newTitleData]).select().single();
            // console.log("Response for adding appointment reason",res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// update appointment
export const updateAppointmentReason = createAsyncThunk("appointmentReasonSlice/updateAppointmentReason",
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Recived data for updating appointment reason', id, updatedData);

        try {
            const res = await supabase.from("appointment_reason").update(updatedData).eq("id", id).select().single();
            // console.log("Response for updating appointment reason",res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// update appointment status
export const updateAppointmentReasonStatus = createAsyncThunk("appointmentReasonSlice/updateAppointmentReasonStatus",
    async ({ id, status }, { rejectWithValue }) => {
        // console.log('Recived data for update appointment reason status', id, status);

        try {
            const { error } = await supabase.from("appointment_reason").update({ status }).eq("id", id);

            if (error) throw error;
            return { id, status };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// delete appointment
export const deleteAppointmentReason = createAsyncThunk("appointmentReasonSlice/deleteAppointmentReason",
    async (id, { rejectWithValue }) => {
        // console.log('Receive Id to delete appointment reason', id);

        try {
            const { error } = await supabase.from("appointment_reason").delete().eq("id", id);

            if (error) throw error;
            return id;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    reasonsData: [],
    isReasonsLoading: false,
    hasReasonerror: null
}

export const appointmentReasonSlice = createSlice({
    name: "appointmentReasonSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* FETCH */
            .addCase(fetchAppointmentReasons.pending, (state) => {
                state.isReasonsLoading = true;
            })
            .addCase(fetchAppointmentReasons.fulfilled, (state, action) => {
                state.isReasonsLoading = false;
                state.reasonsData = action.payload;
            })
            .addCase(fetchAppointmentReasons.rejected, (state, action) => {
                state.isReasonsLoading = false;
                state.hasReasonerror = action.payload;
            })

            /* ADD */
            .addCase(addAppointmentReason.pending, (state) => {
                state.isReasonsLoading = true;
            })
            .addCase(addAppointmentReason.fulfilled, (state, action) => {
                state.isReasonsLoading = false;
                state.reasonsData.unshift(action.payload);
            })
            .addCase(addAppointmentReason.rejected, (state, action) => {
                state.isReasonsLoading = false;
                state.hasReasonerror = action.payload;
            })

            /* UPDATE ALL */
            .addCase(updateAppointmentReason.pending, (state) => {
                state.isReasonsLoading = true;
            })
            .addCase(updateAppointmentReason.fulfilled, (state, action) => {
                state.isReasonsLoading = false;
                const index = state.reasonsData.findIndex(
                    (r) => r.id === action.payload.id
                );
                if (index !== -1) {
                    state.reasonsData[index] = action.payload;
                }
            })

            /* UPDATE STATUS */
            .addCase(updateAppointmentReasonStatus.pending, (state) => {
                state.isReasonsLoading = true;
            })
            .addCase(updateAppointmentReasonStatus.fulfilled, (state, action) => {
                state.isReasonsLoading = false;
                const reason = state.reasonsData.find(
                    (r) => r.id === action.payload.id
                );
                if (reason) {
                    reason.status = action.payload.status;
                }
            })

            /* DELETE */
            .addCase(deleteAppointmentReason.pending, (state) => {
                state.isReasonsLoading = true;
            })
            .addCase(deleteAppointmentReason.fulfilled, (state, action) => {
                state.isReasonsLoading = false;
                state.reasonsData = state.reasonsData.filter(
                    (r) => r.id !== action.payload
                );
            });
    },
});

export default appointmentReasonSlice.reducer;
