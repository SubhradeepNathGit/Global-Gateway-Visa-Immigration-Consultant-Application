import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// user wise cart 
export const getOrCreateCart = createAsyncThunk("cartSlice/getOrCreateCart",
    async (userId, { rejectWithValue }) => {
        // console.log('User wise cart details check', userId);

        try {
            // Check if cart exists
            const { data: cart } = await supabase.from("carts").select("*").eq("user_id", userId).single();

            if (cart) return cart;

            // Create new cart
            const res = await supabase.from("carts").insert({ user_id: userId }).select().single();
            // console.log('Response for creating new cart', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// view cart 
export const fetchCartItems = createAsyncThunk("cartSlice/fetchCartItems",
    async (cartId, { rejectWithValue }) => {
        // console.log('Fetching details for cart id', cartId);

        try {
            const res = await supabase.from("cart_items").select(`
          id,course_id, courses (*,course_content (*))`).eq("cart_id", cartId);
            // console.log('Response for cart details', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// add item cart 
export const addCartItem = createAsyncThunk("cartSlice/addCartItem",
    async ({ cartId, courseId }, { rejectWithValue }) => {
        // console.log('Add course Id in cart in slice', cartId, courseId);

        try {
            const res = await supabase.from("cart_items").insert({
                cart_id: cartId,
                course_id: courseId
            }).select().single();
            // console.log('Response for adding items in cart', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// remove item cart 
export const removeCartItem = createAsyncThunk("cartSlice/removeCartItem",
    async ({ cartId, courseId }, { rejectWithValue }) => {
        // console.log('Cart Id and Course Id for removing item', cartId, courseId);

        try {
            const { error } = await supabase.from("cart_items").delete().eq("cart_id", cartId).eq("course_id", courseId);

            if (error) throw error;

            return courseId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// delete Cart
export const deleteCart = createAsyncThunk("cartSlice/deleteCart",
    async (cartId, { rejectWithValue }) => {
        // console.log('Deleting cart id', cartId);

        try {
            const { error } = await supabase.from("carts").delete().eq("id", cartId);

            if (error) throw error;

            return cartId;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    currentCart: null,
    cartItems: [],
    isCartLoading: false,
    isCartAddLoading: false,
    hasCartError: null
}

export const cartSlice = createSlice({
    name: "cartSlice",
    initialState,
    reducers: {
        clearCartState: (state) => {
            state.currentCart = null;
            state.cartItems = [];
        }
    },
    extraReducers: (builder) => {
        builder
            /* Get/Create Cart */
            .addCase(getOrCreateCart.pending, (state) => {
                state.isCartLoading = true;
            })
            .addCase(getOrCreateCart.fulfilled, (state, action) => {
                state.isCartLoading = false;
                state.currentCart = action.payload;
            })
            .addCase(getOrCreateCart.rejected, (state, action) => {
                state.isCartLoading = false;
                state.hasCartError = action.payload;
            })

            /* Fetch Cart cartItems */
            .addCase(fetchCartItems.pending, (state) => {
                state.isCartLoading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.isCartLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.isCartLoading = false;
                state.hasCartError = action.payload;
            })

            /* Add Item */
            .addCase(addCartItem.pending, (state) => {
                state.isCartAddLoading = true;
            })
            .addCase(addCartItem.fulfilled, (state, action) => {
                state.isCartAddLoading = false;
                state.cartItems.push(action.payload);
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.isCartAddLoading = false;
                state.hasCartError = action.payload;
            })

            /* Remove Item */
            .addCase(removeCartItem.pending, (state) => {
                state.isCartLoading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                state.isCartLoading = false;
                state.cartItems = state.cartItems.filter(
                    (item) => item.course_id !== action.payload
                );
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.isCartLoading = false;
                state.hasCartError = action.payload;
            })

            /* Delete Cart */
            .addCase(deleteCart.pending, (state) => {
                state.isCartLoading = true;
            })
            .addCase(deleteCart.fulfilled, (state) => {
                state.isCartLoading = false;
                state.currentCart = null;
                state.cartItems = [];
            })
            .addCase(deleteCart.rejected, (state, action) => {
                state.isCartLoading = false;
                state.hasCartError = action.payload;
            });
    }
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;