import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// add contact slice
export const addContactMessage = createAsyncThunk("contactSlice/addContactMessage",
    async (data, { rejectWithValue }) => {
        try {
            // console.log('Received data for contact in slice', data);

            const res = await supabase.from("contact_messages").insert(data);
            // console.log('Response for adding contact data', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch all contact messages
export const fetchAllContactMessages = createAsyncThunk("contactSlice/fetchAllContactMessages",
    async (_, { rejectWithValue }) => {
        try {
            const res = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
            // console.log('Response for fetching all contact message', res);

            if (res?.error) return rejectWithValue(res?.error.message);
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// add reply or reject
export const updateMessage = createAsyncThunk("contactSlice/updateMessage",
    async ({ id, status, reply_subject, reply_message }, { rejectWithValue }) => {
        // console.log('Receive data for updating status and reply in contact slice', id, status, reply_subject, reply_message);

        try {
            const updateObj = {};

            if (status !== undefined) updateObj.status = status;
            if (reply_subject !== undefined) updateObj.reply_subject = reply_subject;
            if (reply_message !== undefined) updateObj.reply_message = reply_message;

            const res = await supabase.from("contact_messages").update(updateObj).eq("id", id).select().single();
            // console.log('Response after updating status and reply in contact slice', res);

            if (res?.error) return rejectWithValue(res?.error.message);
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    contactLoading: false,
    contactData: [],
    contactError: null
}

export const contactSlice = createSlice({
    name: "contactSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // add a contact messages slice
            .addCase(addContactMessage.pending, (state) => {
                state.contactLoading = true;
            })
            .addCase(addContactMessage.fulfilled, (state, action) => {
                state.contactLoading = false;
                state.contactData = action.payload;
            })
            .addCase(addContactMessage.rejected, (state, action) => {
                state.contactLoading = false;
                state.contactError = action.payload || "Failed to send message";
            })

            // Fetch all contact messages slice
            .addCase(fetchAllContactMessages.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(fetchAllContactMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.contactData = action.payload;
            })
            .addCase(fetchAllContactMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.error.message;
            })

            // add reply or reject contact msg
            .addCase(updateMessage.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = null;
            })
            .addCase(updateMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                const updatedMsg = action.payload;
                state.contactData = state.contactData.map(msg =>
                    msg.id === updatedMsg.id ? updatedMsg : msg
                );
            })
            .addCase(updateMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload;
            });
    },
});

export default contactSlice.reducer;