import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../../util/Supabase/supabase";
import { fetchCountryByName } from "../countrySlice";
import { fetchCountryDetails } from "../../../functions/fetchCountryDetails";
import { verifyUser } from "./verification";

// register slice 
export const registerUser = createAsyncThunk("authSlice/registerUser",
  async (data, { rejectWithValue, dispatch }) => {
    // console.log('Received register data', data);

    try {
      let apiData = {};
      const redirectUrl = `${import.meta.env.VITE_CHECKOUT_ENDPOINT}/verification/${data.email}/${data.role || "user"}`;

      if (data.role === "embassy" && data.country_name) {
        try {
          apiData = await fetchCountryDetails(data.country_name);
        } catch (err) {
          return rejectWithValue(`Invalid country name: ${data.country_name}`);
        }
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.name },
          emailRedirectTo: redirectUrl,
        }
      });

      // console.log('Register user in auth table data', signUpData, signUpError);

      if (signUpError) return rejectWithValue(signUpError.message);

      const userId = signUpData.user.id;
      const { data: exists } = await supabase.from("users").select("id").eq("email", data.email).single();

      if (exists) {
        return rejectWithValue("Email ID already exists");
      }

      let fileName = null, publicUrl = null;
      let insertData = null, insertError = null;

      // insert pic for user 
      if (data.role == 'user') {
        const file = data.avatar[0];
        fileName = `${userId}_${Date.now()}.${file.name.split(".").pop()}`;

        const { error: uploadError } = await supabase.storage.from("user")
          .upload(fileName, file, {
            upsert: true,
          });

        if (uploadError) return rejectWithValue(uploadError.message);

        const { data: urlData } = supabase.storage.from("user").getPublicUrl(fileName);
        publicUrl = urlData.publicUrl;
      }

      if (data.role === "embassy") {

        // upload doc for embassy
        const pdfFile = data.embassy_doc;
        fileName = `verification_doc/${userId}_${Date.now()}.${pdfFile.name.split(".").pop()}`;

        const { error: pdfUploadError } = await supabase.storage.from("embassy")
          .upload(fileName, pdfFile, {
            upsert: true,
          });

        if (pdfUploadError) return rejectWithValue(pdfUploadError.message);

        const { data: pdfUrlData } = supabase.storage.from("embassy").getPublicUrl(fileName);
        // console.log('Response for upload doc', pdfUrlData);

        publicUrl = pdfUrlData.publicUrl;

        // fetch country by country name
        const countryResult = await dispatch(fetchCountryByName(data.country_name)).unwrap();
        // console.log('Country fetching result', countryResult);

        const countryAvailable = !!countryResult;
        const countryName = countryResult?.name || data.country_name;
        const countryId = countryResult?.id || null;

        let { data: insertData, error: insertError } = await supabase.from("embassy")
          .insert({
            id: userId,
            country_name: countryName,
            country_id: countryId,
            email: data?.email,
            is_verified: "pending",
            is_country_available: countryAvailable,
            is_country_listed:countryAvailable,
            is_blocked: data?.is_blocked,
            is_approved: data?.is_approved,
            last_sign_in_at: null,
            providers: signUpData?.user.app_metadata?.provider,
            role: data?.role,
            document: publicUrl
          });
      }
      else {
        // insert into custom table
        let { data: insertData, error: insertError } = await supabase.from("users").insert({
          id: userId,
          name: data?.name,
          phone: data?.phone,
          email: data?.email,
          country: data?.country ?? null,
          avatar: fileName,
          avatar_url: publicUrl,
          is_verified: "pending",
          is_blocked: data?.is_blocked,
          last_sign_in_at: null,
          providers: signUpData?.user.app_metadata.provider,
          role: data?.role
        });
        // console.log('Response after inserting data in public user table', insertData, insertError);

      }
      if (insertError) return rejectWithValue(insertError.message);

      return insertData;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
)

// verify OTP slice
export const verifyOtp = createAsyncThunk("authSlice/verifyOtp",
  async ({ email, token, type, role }, { rejectWithValue, dispatch }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: type || 'signup'
      });

      if (error) return rejectWithValue(error.message);

      // After successful OTP verification for signup, update our custom table
      if (type === 'signup') {
        const verifyRes = await dispatch(verifyUser({ email, user_type: role, status: 'success' })).unwrap();
        return { user: verifyRes?.[0], session: data.session };
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// forgot password slice
export const forgotPassword = createAsyncThunk("authSlice/forgotPassword",
  async ({ email, redirectTo }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo
      });

      if (error) return rejectWithValue(error.message);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// resend OTP slice
export const resendOtp = createAsyncThunk("authSlice/resendOtp",
  async ({ email, type = 'signup' }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resend({
        type,
        email,
      });
      if (error) return rejectWithValue(error.message);
      return email;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// login slice 
export const loginUser = createAsyncThunk("authSlice/loginUser",
  async ({ email, password, role }, { rejectWithValue }) => {
    // console.log('Received data for login', email, password, role);

    try {
      const authRes = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      // console.log('Response for login embassy', authRes);

      if (authRes?.error) return rejectWithValue(authRes?.error.message);

      const accessToken = authRes?.data?.session?.access_token;
      const refreshToken = authRes?.data?.session?.refresh_token;

      const userId = authRes?.data.user.id;
      let userData = null, userError = null;

      if (role === "embassy") {
        ({ data: userData, error: userError } = await supabase.from("embassy").select("*").eq("id", userId).single());
      }
      else {
        ({ data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single());
      }

      if (!userData)
        return rejectWithValue("Invalid Login Credentials");

      if (role !== "embassy" && userData?.is_approved == 'pending')
        return rejectWithValue("Your application still processing");

      if (role !== "embassy" && userData?.is_approved == 'rejected')
        return rejectWithValue("Your application is rejected");

      if (userData.is_blocked)
        return rejectWithValue("You are blocked. Please contact admin.");

      if (userData.role != role) {
        return rejectWithValue((role == 'admin' ? "Admin" : role == 'user' ? "User" : "embassy") + " doesn't exist.");
      }
      return {
        user: userData,
        accessToken,
        refreshToken,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


const initialState = {
  userAuthData: null,
  isUserAuthLoading: false,
  userAuthError: null
}

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  extraReducers: (builder) => {
    // REGISTER
    builder
      .addCase(registerUser.pending, (state) => {
        state.isUserAuthLoading = true;
        state.userAuthError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isUserAuthLoading = false;
        const error = action.payload || action.error?.message || "Something went wrong";

        if (typeof error === "string") {
          if (
            error.includes("users_pkey") ||
            error.includes("users_email_key") ||
            error.includes("duplicate key")
          ) {
            state.userAuthError = "Email ID already exists";
            return;
          }
        }

        state.userAuthError = error;
      })

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.isUserAuthLoading = true;
        state.userAuthError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthError = action.payload;
      })

    // VERIFY OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.isUserAuthLoading = true;
        state.userAuthError = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthData = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthError = action.payload;
      })

    // FORGOT PASSWORD
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isUserAuthLoading = true;
        state.userAuthError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isUserAuthLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthError = action.payload;
      });

    // RESEND OTP
    builder
      .addCase(resendOtp.pending, (state) => {
        state.isUserAuthLoading = true;
        state.userAuthError = null;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.isUserAuthLoading = false;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.isUserAuthLoading = false;
        state.userAuthError = action.payload;
      });
  },
});

export default authSlice.reducer;