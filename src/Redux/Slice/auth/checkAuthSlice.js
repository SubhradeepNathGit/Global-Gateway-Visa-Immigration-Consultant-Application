import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/Supabase/supabase";
import toastifyAlert from "../../../util/alert/toastify";

// fetch logged user details
export const fetchLoggedUserDetails = createAsyncThunk("checkUserAuthSlice/fetchLoggedUserDetails",
    async (userId, { rejectWithValue }) => {
        try {
            const res = await supabase.from("users").select("*").eq("id", userId).single();
            // console.log('Logged user details', res);

            if (res?.error) throw new Error(res?.error.message);
            return res?.data;
        }
        catch (err) {
            const message = err?.message ?? "Failed to fetch user details";
            return rejectWithValue(message);
        }
    });

// Check if user session exists
export const checkLoggedInUser = () => async (dispatch) => {
    const { data, error } = await supabase.auth.getSession();

    // console.log('Logged data', data);

    if (error) {
        console.error("Error fetching session:", error.message);
        dispatch(clearUser());
        return;
    }

    if (data.session?.user) {
        dispatch(
            setuser({
                user: data.session.user,
                session: data.session,
            })
        );

        // Fetch users details
        dispatch(fetchLoggedUserDetails(data.session.user.id));
    } else {
        dispatch(clearUser());
    }
}

// Listen for Supabase Auth login/logout
export const listenAuthChanges = () => (dispatch) => {
    supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
            dispatch(
                setuser({
                    user: session.user,
                    session,
                })
            );

            // Fetch user profile from users
            dispatch(fetchLoggedUserDetails(session.user.id));
        } else {
            dispatch(clearUser());
        }
    })
}

// Logout
export const logoutUser = ({ user_type, showAlert = true }) => async (dispatch) => {
    try {
        const token = sessionStorage.getItem(user_type == 'admin' ? "admin_token" : user_type == 'user' ? "user_token" : "embassy_token");
        if (token) sessionStorage.removeItem(user_type == 'admin' ? "admin_token" : user_type == 'user' ? "user_token" : "embassy_token");

        const { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        dispatch(clearUser());

        showAlert && toastifyAlert.success("Logged out successfully");
    }
    catch (err) {
        console.error("Logout error:", err);
        toastifyAlert.error("Logout failed");
    }
}

const initialState = {
    isuserAuth: false,
    userAuthData: undefined,
    session: undefined,
    isuserLoading: false,
    userError: null,
}

export const checkUserAuthSlice = createSlice({
    name: "checkUserAuthSlice",
    initialState,
    reducers: {
        setuser: (state, action) => {
            state.isuserAuth = true;
            state.userAuthData = action.payload.user;
            state.session = action.payload.session;
            state.userError = null;
        },
        clearUser: (state) => {
            state.isuserAuth = false;
            state.userAuthData = undefined;
            state.session = undefined;
            state.userError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoggedUserDetails.pending, (state) => {
                state.isuserLoading = true;
            })
            .addCase(fetchLoggedUserDetails.fulfilled, (state, action) => {
                state.isuserLoading = false;
                state.userAuthData = action.payload;
            })
            .addCase(fetchLoggedUserDetails.rejected, (state, action) => {
                state.isuserLoading = false;
                state.userError = action.payload || "Failed to fetch user details";
            });
    },
})

export const { setuser, clearUser } = checkUserAuthSlice.actions;
export default checkUserAuthSlice.reducer;