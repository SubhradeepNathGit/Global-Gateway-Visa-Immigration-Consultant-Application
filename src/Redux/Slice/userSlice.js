import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkLoggedInUser } from "./auth/checkAuthSlice";
import supabase from "../../util/Supabase/supabase";

// update user profile action 
export const updateUserProfile = createAsyncThunk("userProfileSlice/updateUserProfile",
    async ({ data, id }, { rejectWithValue, dispatch }) => {
        // console.log('update data', data, ' user Id', id);

        try {
            const file = data.profile_image;
            if (!file) return rejectWithValue("No file provided");

            // Fetch existing user profile
            const { data: user, error: fetchErr } = await supabase.from("users").select("avatar").eq("id", id).single();
            // console.log('Fetched profile image', user);

            if (fetchErr) throw fetchErr;

            // delete old image from bucket
            if (user?.avatar) {
                await supabase.storage.from("user").remove(user?.avatar);
            }

            // Create new filename
            const ext = file.name.split(".").pop();
            const newFileName = `${id}_${Date.now()}.${file.name.split(".").pop()}.${ext}`;

            // Upload new file
            const res = await supabase.storage.from("user").upload(newFileName, file, { upsert: true });

            if (res.error) throw res.error;
            // console.log('upload data', res.data);

            const image_name = res?.data?.path;

            // Get public URL
            const { data: publicUrlData } = supabase.storage.from("user").getPublicUrl(newFileName);

            const publicUrl = publicUrlData.publicUrl;

            // Update DB with PUBLIC URL again
            const { data: updatedUser, error: updateErr } = await supabase.from("users").update({
                avatar_url: publicUrl,
                avatar: image_name,
            }).eq("id", id).select().single();

            if (updateErr) throw updateErr;
            dispatch(checkLoggedInUser());

            return updatedUser;
        } catch (err) {
            console.error("Error updating profile:", err);
            return rejectWithValue(err.message);
        }
    }
);

// updates `last_sign_in_at`
export const updateLastSignInAt = createAsyncThunk("userProfileSlice/updateLastSignInAt",
    async ({ id, user_type }, { rejectWithValue }) => {
        // console.log('update login data', id,user_type);

        try {
            let res = null;
            if (user_type == 'embassy') {
                res = await supabase.from("embassy").update({ last_sign_in_at: new Date().toISOString() }).eq("id", id).select();
            }
            else {
                res = await supabase.from("users").update({ last_sign_in_at: new Date().toISOString() }).eq("id", id).select();
            }
            // console.log('Response for updating sign-in time', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// updates `course purchase or not`
export const updateCoursePurchaseStatus = createAsyncThunk("userProfileSlice/updateCoursePurchaseStatus",
    async ({ id }, { rejectWithValue }) => {
        // console.log('update purchase course data', id,user_type);

        try {
            const res = await supabase.from("users").update({ has_purchase_course: true }).eq("id", id).select();

            // console.log('Response for updating purchase status', res);

            if (res?.error) return rejectWithValue(res?.error);

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// get all users 
export const getAllUsers = createAsyncThunk("userProfileSlice/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            // Fetch users table
            const { data: usersData, error: usersError } = await supabase.from("users").select("*").eq("role", "user").order("created_at", { ascending: false });
            // console.log('Response for fetching user data', usersData, usersError);

            if (usersError) throw usersError;

            return usersData;
        } catch (err) {
            console.error("Error fetching users:", err);
            return rejectWithValue(err.message);
        }
    }
);

// change user status
export const toggleUserStatus = createAsyncThunk('userProfileSlice/toggleUserStatus',
    async ({ id, currentStatus }) => {
        // console.log('Status changable details', id, currentStatus);

        try {
            const newStatus = !currentStatus;
            const res = await supabase.from("users").update({ is_blocked: newStatus }).eq("id", id).select().single();
            // console.log('Response for updating user status', res);

            if (res?.error) throw res?.error;

            return res?.data;
        } catch (err) {
            console.error("Error updating block status:", err.message);
            return null;
        }
    }
)

const initialState = {
    isUserLoading: false,
    getUserData: [],
    isUserError: null,
};

export const userProfileSlice = createSlice({
    name: "userProfileSlice",
    initialState,
    extraReducers: (builder) => {
        builder

            // update user profile reducer 
            .addCase(updateUserProfile.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = action.payload;
                state.isUserError = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = {};
                state.isUserError = action.error?.message;
            })

            // updates `last_sign_in_at` reducer 
            .addCase(updateLastSignInAt.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(updateLastSignInAt.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = action.payload;
                state.isUserError = null;
            })
            .addCase(updateLastSignInAt.rejected, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = {};
                state.isUserError = action.error?.message;
            })
            
            // updates `course purchase ststua` reducer 
            .addCase(updateCoursePurchaseStatus.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(updateCoursePurchaseStatus.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = action.payload;
                state.isUserError = null;
            })
            .addCase(updateCoursePurchaseStatus.rejected, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = {};
                state.isUserError = action.error?.message;
            })

            // fetch all users
            .addCase(getAllUsers.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = action.payload;
                state.isUserError = null;
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.isUserLoading = false;
                state.isUserError = action.payload || action.error.message;
            })

            // change user status
            .addCase(toggleUserStatus.pending, (state) => {
                state.isUserLoading = true;
            })
            .addCase(toggleUserStatus.fulfilled, (state, action) => {
                state.isUserLoading = false;
                state.getUserData = state.getUserData.map(u => u.id === action.payload.id ? action.payload : u);
                state.isUserError = null;
            })
            .addCase(toggleUserStatus.rejected, (state, action) => {
                state.isUserLoading = false;
                state.isUserError = action.payload || action.error.message;
            })
    }
});

export default userProfileSlice.reducer;