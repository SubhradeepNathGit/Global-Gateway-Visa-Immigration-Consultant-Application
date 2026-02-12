import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// Fetch all certificates for a user
export const fetchUserCertificates = createAsyncThunk("certificateSlice/fetchUserCertificates",
    async ({ userId }, { rejectWithValue }) => {
        // console.log('Received data for fetching certificate details', userId, course_id);

        try {
            const res = await supabase.from("certificates").select("*").eq("user_id", userId);
            // console.log('Response for fetching certificate details', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Fetch a specific certificate for a user
export const fetchUserSpecificCertificates = createAsyncThunk("certificateSlice/fetchUserSpecificCertificates",
    async ({ userId, course_id }, { rejectWithValue }) => {
        // console.log('Received data for fetching specific certificate details', userId, course_id);

        try {
            const res = await supabase.from("certificates").select("*").eq("user_id", userId).eq("course_id", course_id);
            // console.log('Response for fetching a specific certificate details', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Add a new certificate
export const addCertificate = createAsyncThunk("certificateSlice/addCertificate",
    async ({ userId, courses }, { rejectWithValue }) => {
        console.log('Received data for certificate addition', userId, courses);

        try {

            const certificateData = courses.map((course) => ({
                user_id: userId,
                course_id: course.course_id,
                certificate_available: false,
                access_doc_name: [],
                progress: '0'
            }));

            const res = await supabase.from("certificates").insert(certificateData).select();
            console.log('Response for adding new certificate', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// Update a certificate
export const updateCertificate = createAsyncThunk("certificateSlice/updateCertificate",
    async ({ userId, courseId, certificateAvailable, progress, updatedDocs, certificateRegDate }, { rejectWithValue }) => {
        // console.log('Received data for updating certificate data', userId, courseId, certificateAvailable, progress,updatedDocs, certificateRegDate);

        try {
            const res = await supabase.from("certificates").update({
                certificate_available: certificateAvailable,
                progress: progress,
                access_doc_name: updatedDocs,
                certificate_reg_date: certificateRegDate,
            }).eq("user_id", userId).eq("course_id", courseId).select().single();
            // console.log('Response for updating certificate deta', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


// Helper to update progress & access_doc_name
export const handleCertificateProgress = (userId, courseId, docName, totalDocs) =>
    async (dispatch, getState) => {

        const { certificates } = getState().certificate;

        if (!Array.isArray(certificates) || certificates.length === 0) {
            return; // wait until fetched
        }

        const cert = certificates.find(
            c => c.user_id === userId && c.course_id === courseId
        );

        if (!cert) return;
        if (cert.certificate_available) return;

        const accessedDocs = cert.access_doc_name || [];
        const updatedDocs = accessedDocs.includes(docName)
            ? accessedDocs
            : [...accessedDocs, docName];

        const progress = Math.round((updatedDocs.length / totalDocs) * 100);
        const certificateAvailable = progress === 100;

        await dispatch(updateCertificate({
            userId,
            courseId,
            updatedDocs,
            progress: String(progress),
            certificateAvailable,
            certificateRegDate: certificateAvailable
                ? new Date().toISOString()
                : cert.certificate_reg_date,
        }));
        return ({progress, certificateAvailable});
    };


const initialState = {
    certificates: [],
    specificCertificate: null,
    isCertificateLoading: false,
    hasCertificateError: null,
};

export const certificateSlice = createSlice({
    name: "certificateSlice",
    initialState,
    reducers: {
        resetCertificatesState: (state) => {
            state.certificates = [];
            state.isCertificateLoading = false;
            state.hasCertificateError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchUserCertificates.pending, (state) => {
                state.isCertificateLoading = true;
                state.hasCertificateError = null;
            })
            .addCase(fetchUserCertificates.fulfilled, (state, action) => {
                state.isCertificateLoading = false;
                state.certificates = action.payload ?? [];
            })
            .addCase(fetchUserCertificates.rejected, (state, action) => {
                state.isCertificateLoading = false;
                state.hasCertificateError = action.payload;
            })

            // Fetch a specific
            .addCase(fetchUserSpecificCertificates.pending, (state) => {
                state.isCertificateLoading = true;
                state.hasCertificateError = null;
            })
            .addCase(fetchUserSpecificCertificates.fulfilled, (state, action) => {
                state.isCertificateLoading = false;
                state.specificCertificate = action.payload ?? [];
            })
            .addCase(fetchUserSpecificCertificates.rejected, (state, action) => {
                state.isCertificateLoading = false;
                state.hasCertificateError = action.payload;
            })

            // Add
            .addCase(addCertificate.pending, (state) => {
                state.isCertificateLoading = true;
                state.hasCertificateError = null;
            })
            .addCase(addCertificate.fulfilled, (state, action) => {
                state.isCertificateLoading = false;
                state.certificates.push(...action.payload);
            })
            .addCase(addCertificate.rejected, (state, action) => {
                state.isCertificateLoading = false;
                state.hasCertificateError = action.payload;
            })

            // Update
            .addCase(updateCertificate.pending, (state) => {
                state.isCertificateLoading = true;
                state.hasCertificateError = null;
            })
            .addCase(updateCertificate.fulfilled, (state, action) => {
                state.isCertificateLoading = false;
                const index = state.certificates.findIndex(c => c.id === action.payload.id);
                if (index !== -1) state.certificates[index] = action.payload;
            })
            .addCase(updateCertificate.rejected, (state, action) => {
                state.isCertificateLoading = false;
                state.hasCertificateError = action.payload;
            });
    },
});

export const { resetCertificatesState } = certificateSlice.actions;
export default certificateSlice.reducer;