import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";


// add notifications 
export const addNotification = createAsyncThunk("notificationSlice/addNotification",
    async (notification_obj, { rejectWithValue }) => {
        // console.log("Received notification to add", notification_obj);

        try {
            const { receiver_country_id, ...notification_data } = notification_obj;

            let payload = [];

            if (receiver_country_id == null || receiver_country_id?.length == 0) {
                payload = [{ ...notification_data, },];
            }
            else {
                const receiverIds = Array.isArray(receiver_country_id) ? receiver_country_id : [receiver_country_id];

                payload = receiverIds?.map(id => ({
                    ...notification_data,
                    receiver_country_id: id,
                }));
            }

            const res = await supabase.from("notifications").insert(payload).select();
            // console.log('Response for adding notification', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)


// fetch all notifications
export const fetchNotifications = createAsyncThunk("notificationSlice/fetchNotifications",
    async ({ receiver_type, receiver_country_id, user_id }, { rejectWithValue }) => {
        // console.log('Received data for fetching notifications', receiver_type, receiver_country_id);

        try {
            if (receiver_type === "embassy" && !receiver_country_id) {
                return [];
            }

            let query = supabase.from("notifications").select("*").eq("receiver_type", receiver_type).eq("mark_read", false).order("created_at", { ascending: false });

            if (receiver_type === "admin") {
                query = query.is("receiver_country_id", null);
            }

            if (receiver_type === "embassy") {
                query = query.eq("receiver_country_id", receiver_country_id);
            }

            if (receiver_type === "user") {
                query = query.eq("user_id", user_id);
            }

            const res = await query;
            // console.log('Response for fetching notification', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// update notification
export const markNotificationRead = createAsyncThunk("notificationSlice/markNotificationRead",
    async ({ id, receiver_type, receiver_id, user_id }, { rejectWithValue }) => {
        // console.log('Received data for updating', id, receiver_type, receiver_id, user_id);

        try {
            let query = supabase.from("notifications").update({ mark_read: true });

            // Single notification
            if (id) query = query.eq("id", id);

            // All by receiver_type
            if (receiver_type) query = query.eq("receiver_type", receiver_type);

            // Narrow down by receiver_id
            if (receiver_id) query = query.eq("receiver_country_id", receiver_id);

            // Narrow down by user_id
            if (user_id) query = query.eq("user_id", user_id);

            const res = await query.select();
            // console.log('Response for updating all notification', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)


const initialState = {
    notificationList: [],
    isNotificationLoading: false,
    hasNotificationError: null,
}

export const notificationSlice = createSlice({
    name: "notificationSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // add notifications 
            .addCase(addNotification.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(addNotification.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                // state.notificationList = action.payload;
            })
            .addCase(addNotification.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.hasNotificationError = action.payload;
            })

            // fetch all notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                state.notificationList = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.hasNotificationError = action.payload;
            })

            // update notification
            .addCase(markNotificationRead.pending, (state) => {
                state.isNotificationLoading = true;
            })
            .addCase(markNotificationRead.fulfilled, (state, action) => {
                state.isNotificationLoading = false;
                // const index = state.notificationList.findIndex(
                //     (n) => n.id === action.payload.id
                // );
                // if (index !== -1) {
                //     state.notificationList[index].mark_read = true;
                // }
            })
            .addCase(markNotificationRead.rejected, (state, action) => {
                state.isNotificationLoading = false;
                state.hasNotificationError = action.payload;
            })
    },
});

export default notificationSlice.reducer;