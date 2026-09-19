import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import supabase from "../../../util/Supabase/supabase";
import toastifyAlert from "../../../util/alert/toastify";

// fetch logged user details
export const fetchLoggedUserDetails = createAsyncThunk("checkUserAuthSlice/fetchLoggedUserDetails",
    async (userId, { rejectWithValue }) => {
        try {
            const isEmbassy = !!sessionStorage.getItem("embassy_token");
            const firstTable = isEmbassy ? "embassy" : "users";
            const secondTable = isEmbassy ? "users" : "embassy";

            let res = await supabase.from(firstTable).select("*").eq("id", userId).maybeSingle();

            if (res?.error) throw new Error(res.error.message);

            if (!res?.data) {
                res = await supabase.from(secondTable).select("*").eq("id", userId).maybeSingle();
                if (res?.error) throw new Error(res.error.message);
            }

            if (!res?.data) throw new Error("User not found");

            return res.data;
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
export const listenAuthChanges = () => (dispatch, getState) => {
    supabase.auth.onAuthStateChange((event, session) => {
        // INITIAL_SESSION is already handled by checkLoggedInUser() on app boot.
        // Skip it to avoid a double-init on startup.
        if (event === 'INITIAL_SESSION') return;

        const authState = getState().checkAuth;

        // If the same user is already authenticated, skip ALL silent background
        // events (TOKEN_REFRESHED, SIGNED_IN, USER_UPDATED, etc.) that Supabase
        // fires when you switch/return to a browser tab.
        // Re-dispatching setuser() on these events causes fetchLoggedUserDetails
        // to run again, which briefly makes userAuthData lose its .role field,
        // which triggers ProtectedRoute's role-check redirect → back to dashboard.
        if (
            session?.user &&
            authState.isuserAuth &&
            authState.userAuthData?.id === session.user.id &&
            (event === 'TOKEN_REFRESHED' ||
             event === 'SIGNED_IN' ||
             event === 'USER_UPDATED')
        ) {
            return;
        }

        if (session?.user) {
            dispatch(
                setuser({
                    user: session.user,
                    session,
                })
            );

            // Fetch user profile from the database
            dispatch(fetchLoggedUserDetails(session.user.id));
        } else {
            // Only SIGNED_OUT should clear the user
            dispatch(clearUser());
        }
    })
}

// Logout
export const logoutUser = ({ user_type, showAlert = true }) => async (dispatch) => {
    try {
        dispatch(setLoggingOut(true));
        const token = sessionStorage.getItem(user_type == 'admin' ? "admin_token" : user_type == 'user' ? "user_token" : "embassy_token");
        if (token) sessionStorage.removeItem(user_type == 'admin' ? "admin_token" : user_type == 'user' ? "user_token" : "embassy_token");

        const { error } = await supabase.auth.signOut();

        if (error) throw new Error(error.message);

        dispatch(clearUser());
        dispatch(setLoggingOut(false));

        showAlert && toastifyAlert.success("Logged out successfully");
    }
    catch (err) {
        console.error("Logout error:", err);
        dispatch(setLoggingOut(false));
        toastifyAlert.error("Logout failed");
    }
}

const initialState = {
    isuserAuth: false,
    userAuthData: null,
    session: null,
    isuserLoading: false,
    isInitialized: false,
    isLoggingOut: false,
    isVerifying: false,
    userError: null,
}

export const checkUserAuthSlice = createSlice({
    name: "checkUserAuthSlice",
    initialState,
    reducers: {
        setuser: (state, action) => {
            state.isuserAuth = true;
            const existingRole = state.userAuthData?.role;
            const hasValidRole = ['admin', 'embassy', 'user'].includes(existingRole);
            state.userAuthData = hasValidRole && state.userAuthData?.id === action.payload.user?.id
                ? { ...action.payload.user, ...state.userAuthData }
                : action.payload.user;
            state.session = action.payload.session;
            state.isInitialized = true;
            state.userError = null;
        },
        clearUser: (state) => {
            state.isuserAuth = false;
            state.userAuthData = null;
            state.session = null;
            state.isInitialized = true;
            state.userError = null;
            state.isVerifying = false;
        },
        setLoggingOut: (state, action) => {
            state.isLoggingOut = action.payload;
        },
        setIsVerifying: (state, action) => {
            state.isVerifying = action.payload;
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
                state.isInitialized = true;
            })
            .addCase(fetchLoggedUserDetails.rejected, (state, action) => {
                state.isuserLoading = false;
                state.userError = action.payload || "Failed to fetch user details";
                state.isInitialized = true;
            })
            // Handle actions from authSlice for immediate state sync
            .addCase("authSlice/loginUser/fulfilled", (state, action) => {
                state.isuserAuth = true;
                state.userAuthData = action.payload.user;
                state.isInitialized = true;
                state.isuserLoading = false;
            })
            .addCase("authSlice/verifyOtp/fulfilled", (state, action) => {
                if (action.payload?.session) {
                    state.isuserAuth = true;
                    state.userAuthData = action.payload.user;
                    state.isInitialized = true;
                    state.isuserLoading = false;
                }
            });
    },
})

export const { setuser, clearUser, setLoggingOut, setIsVerifying } = checkUserAuthSlice.actions;
export default checkUserAuthSlice.reducer;