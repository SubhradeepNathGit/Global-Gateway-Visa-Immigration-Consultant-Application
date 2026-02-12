import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// get all admin 
export const getAllAdmins = createAsyncThunk("adminProfileSlice/getAllAdmins",
    async (_, { rejectWithValue }) => {
        try {
            // Fetch users table
            const { data: adminData, error: adminError } = await supabase.from("users").select("*").eq("role", "admin").order("created_at", { ascending: false });
            // console.log('Response for fetching admin data', adminData, adminError);

            if (adminError) throw adminError;

            return adminData;
        } catch (err) {
            console.error("Error fetching users:", err);
            return rejectWithValue(err.message);
        }
    }
);

// update admin
export const updateAdmin = createAsyncThunk("adminProfileSlice/updateAdmin",
    async ({ id, updateData }, { rejectWithValue }) => {
        console.log('Received data for updating admin', id, updateData);

        try {
            const res = await supabase.from("users").update(updateData).eq("id", id).select().single();
            console.log('Response for updating the admin', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// delete admin
export const deleteUserById = createAsyncThunk("adminProfileSlice/deleteUserById",
    async (adminId, { rejectWithValue }) => {
        // console.log('Deleted admin ID received in slice', adminId);

        try {
            const res = await supabase.auth.admin.deleteUser(adminId);
            // console.log('Response for deleting admin', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return adminId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

const initialState = {
    isAdminLoading: false,
    getAdminData: [],
    isAdminError: null,
};

export const adminProfileSlice = createSlice({
    name: "adminProfileSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // fetch all admins
            .addCase(getAllAdmins.pending, (state) => {
                state.isAdminLoading = true;
            })
            .addCase(getAllAdmins.fulfilled, (state, action) => {
                state.isAdminLoading = false;
                state.getAdminData = action.payload;
                state.isAdminError = null;
            })
            .addCase(getAllAdmins.rejected, (state, action) => {
                state.isAdminLoading = false;
                state.isAdminError = action.payload || action.error.message;
            })

            //   update admin 
            .addCase(updateAdmin.pending, (state) => {
                state.isAdminLoading = true;
            })
            .addCase(updateAdmin.fulfilled, (state, action) => {
                state.isAdminLoading = false;

                const updatedUser = action.payload;
                const index = state.getAdminData.findIndex((u) => u.id === updatedUser.id);

                if (index !== -1) {
                    state.getAdminData[index] = { ...state.getAdminData[index], ...updatedUser };
                }
            })
            .addCase(updateAdmin.rejected, (state, action) => {
                state.isAdminLoading = false;
                state.isAdminError = action.payload;
            })

            // delete admin
            .addCase(deleteUserById.pending, (state) => {
                state.isAdminLoading = true;
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                state.isAdminLoading = false;
                state.getAdminData = state.getAdminData.filter(
                    (admin) => admin.id !== action.payload
                );
                state.isAdminError = null;
            })
            .addCase(deleteUserById.rejected, (state, action) => {
                state.isAdminLoading = false;
                state.isAdminError = action.payload || action.error.message;
            })
    }
});

export default adminProfileSlice.reducer;