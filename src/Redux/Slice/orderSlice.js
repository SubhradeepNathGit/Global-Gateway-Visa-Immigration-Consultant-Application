import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// add order 
export const addOrder = createAsyncThunk("ordersSlice/addOrder",
    async ({ orderData, items }, { rejectWithValue }) => {
        // console.log('Received data to add new order in slice', orderData, items);

        try {
            const res = await supabase.from("orders").insert([orderData]).select().single();
            // console.log('Response for adding new course order', res);

            if (res?.error) throw res?.error;

            const orderItems = items.map(item => ({
                order_id: res?.data?.id,
                course_id: item.course_id,
                price: item.price,
            }));

            const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

            if (itemsError) throw itemsError;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fatch all orders 
export const fetchOrders = createAsyncThunk("ordersSlice/fetchOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await supabase.from("orders").select(`*,order_items (*,courses (*))`).order("created_at", { ascending: false });
            // console.log('Response for fetching all orders', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// fetch user order 
export const fetchUserOrders = createAsyncThunk("ordersSlice/fetchUserOrders",
    async ({ userId, status }, { rejectWithValue }) => {
        // console.log('Received data for fetching specific user course', userId, status);

        try {
            let query = supabase.from("orders").select(`*,order_items (*,courses (*))`).eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (status) {
                query = query.eq("status", status);
            }
            const res = await query;
            // console.log('Response for fetching specific user orders', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    allOrders: [],
    isOrderLoading: false,
    hasOrderError: null,
};

export const ordersSlice = createSlice({
    name: "ordersSlice",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder

            // add new order
            .addCase(addOrder.pending, state => {
                state.isOrderLoading = true;
            })
            .addCase(addOrder.fulfilled, (state, action) => {
                state.isOrderLoading = false;
                state.allOrders.unshift(action.payload);
            })
            .addCase(addOrder.rejected, (state, action) => {
                state.isOrderLoading = false;
                state.hasOrderError = action.payload;
            })

            // fetch all orders
            .addCase(fetchOrders.pending, state => {
                state.isOrderLoading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isOrderLoading = false;
                state.allOrders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isOrderLoading = false;
                state.hasOrderError = action.payload;
            })

            // fetch user order
            .addCase(fetchUserOrders.pending, state => {
                state.isOrderLoading = true;
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.isOrderLoading = false;
                state.allOrders = action.payload;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.isOrderLoading = false;
                state.hasOrderError = action.payload;
            });
    },
});

export default ordersSlice.reducer;