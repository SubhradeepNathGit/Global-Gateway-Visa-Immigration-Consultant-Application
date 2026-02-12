import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// upload cover photo in bucket
const uploadCoverPhoto = async (file, country, folder) => {
    // console.log(file, country, folder);

    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${country}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const res = await supabase.storage.from('embassy').upload(filePath, file);
    // console.log('Response for uploading cover photo in bucket', res);

    if (res?.uploadError) throw res?.uploadError;

    const { data: urlData } = supabase.storage.from('embassy').getPublicUrl(filePath);

    const bucketData = {
        file: { url: urlData.publicUrl },
        url: urlData.publicUrl,
        docName: res.data.path.split('/')[1]
    }
    return bucketData;
};

// delete cover photo from bucket
async function deleteCoverPhoto(embassy_id, folder) {
    // console.log("Image deletion country I'd", country_id, " from", folder," of",dbName);

    try {
        // Fetch existing country images
        const { data: img, error: fetchErr } = await supabase.from('embassy').select("*").eq('id', embassy_id).single();
        // console.log('Fetched image', img);

        if (fetchErr) throw fetchErr;

        const deleted_img = img?.cover_photo_name;

        // delete old documents from bucket
        if (deleted_img) {
            // console.log('Cover photo id', deleted_img);

            const res = await supabase.storage.from("embassy").remove(`${folder}/${deleted_img}`);
            // console.log('Response for deleting cover photo', res);

        }

        return deleted_img;

    } catch (err) {
        console.error("Error deleting document:", err);
    }
}

// Fetch all embassy
export const fetchAllEmbassy = createAsyncThunk("embassySlice/fetchAllEmbassy",
    async (_, { rejectWithValue }) => {

        try {
            const res = await supabase.from("embassy").select("*").order("created_at", { ascending: false });
            // console.log('Response for fetching all embassy', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return res?.data ?? null;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to fetch embassy");
        }
    }
)

// Fetch embassy by country_id
export const fetchEmbassyByCountryId = createAsyncThunk("embassySlice/fetchEmbassyByCountryId",
    async (countryId, { rejectWithValue }) => {
        // console.log('Fetching embassy based on country id', countryId);

        try {
            if (!countryId) return null;
            const res = await supabase.from("embassy").select("*").eq("country_id", countryId).maybeSingle();
            // console.log('Response for fetching embassy based on country id', res);

            if (res?.error) return rejectWithValue(res?.error.message);

            return res?.data ?? null;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to fetch embassy");
        }
    }
)

// fetch specific embassy details
export const fetchEmbassyById = createAsyncThunk("embassySlice/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            // console.log('Fetched embassy details id', id);

            const res = await supabase.from("embassy").select("*").eq("id", id).single();
            // console.log('Response for fetching specific embassy based on country id', res);

            if (res?.error) throw res?.error;
            return res?.data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch embassy");
        }
    }
)

// update embassy details
export const updateEmbassyById = createAsyncThunk("embassySlice/updateEmbassyById",
    async ({ id, updateData }, { rejectWithValue }) => {
        // console.log('Received data for updating embassy', id, updateData);
        const { coverPhoto, ...updatedObj } = updateData;

        try {
            if (!id) { return rejectWithValue("Embassy ID is required"); }

            const res = await supabase.from("embassy").update({
                ...updatedObj,
                updated_at: new Date().toISOString(),
            }).eq("id", id).select().single();
            // console.log('Response for updating embassy details', res);

            if (coverPhoto && !coverPhoto?.isOld) {
                // console.log(coverPhoto);

                deleteCoverPhoto(updatedObj?.id, "cover_photo");

                const photoUrl = await uploadCoverPhoto(coverPhoto.file, updatedObj?.country_name, 'cover_photo')

                const { data: embassyRow, error: embassyErr } = await supabase.from("embassy").update({
                    ...updatedObj,
                    cover_photo: photoUrl,
                    cover_photo_name: photoUrl?.docName || null,
                    cover_photo_url: photoUrl?.url || null
                }).eq("id", id).select().single();

                if (embassyErr) {
                    return rejectWithValue(embassyErr);
                }
            }
            if (res?.error) {
                return rejectWithValue(res?.error.message);
            }

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// update embassy status via ID
export const updateEmbassyStatus = createAsyncThunk("embassySlice/updateEmbassyStatus",
    async ({ id, status, is_blocked, is_country_listed }, { rejectWithValue }) => {
        // console.log('Received data for update embassy status', id, updateData);

        try {
            if (!id) { return rejectWithValue("Embassy ID is required"); }

            const res = await supabase.from("embassy").update({
                is_approved: status,
                is_blocked: is_blocked,
                is_country_listed: is_country_listed,
                updated_at: new Date().toISOString(),
            }).eq("id", id).select().single();
            // console.log('Response for update embassy status', res);

            if (res?.error) {
                return rejectWithValue(res?.error.message);
            }

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// update embassy details via email
export const updateEmbassyByEmail = createAsyncThunk("embassySlice/updateEmbassyByEmail",
    async ({ email, updateData }, { rejectWithValue }) => {
        // console.log('Received data for add embassy additional details', email, updateData);

        try {
            if (!email) { return rejectWithValue("Embassy email is required"); }

            const res = await supabase.from("embassy").update({
                ...updateData,
                updated_at: new Date().toISOString(),
            }).eq("email", email).select().single();
            // console.log('Response for adding embassy additional details', res);

            if (res?.error) {
                return rejectWithValue(res?.error.message);
            }

            return res?.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)


const initialState = {
    embassyData: null,
    allEmbassyData: [],
    isEmbassyLoading: false,
    hasEmbassyerror: null,
}

export const embassySlice = createSlice({
    name: "embassySlice",
    initialState,
    reducers: {
        clearEmbassies: (state) => {
            state.embassyData = [];
            state.hasEmbassyerror = null;
        }
    },
    extraReducers: (builder) => {
        builder

            // embassy by country_id
            .addCase(fetchEmbassyByCountryId.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(fetchEmbassyByCountryId.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.embassyData = action.payload;
            })
            .addCase(fetchEmbassyByCountryId.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })

            // fetch all embassy 
            .addCase(fetchAllEmbassy.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(fetchAllEmbassy.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.allEmbassyData = action.payload;
            })
            .addCase(fetchAllEmbassy.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })

            // specific embassy details
            .addCase(fetchEmbassyById.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(fetchEmbassyById.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.embassyData = action.payload;
            })
            .addCase(fetchEmbassyById.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })

            // update embassy details
            .addCase(updateEmbassyById.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(updateEmbassyById.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.embassyData = action.payload;
            })
            .addCase(updateEmbassyById.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })

            // updating embassy status
            .addCase(updateEmbassyStatus.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(updateEmbassyStatus.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.embassyData = action.payload;
            })
            .addCase(updateEmbassyStatus.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })

            // adding embassy additional details
            .addCase(updateEmbassyByEmail.pending, (state) => {
                state.isEmbassyLoading = true;
            })
            .addCase(updateEmbassyByEmail.fulfilled, (state, action) => {
                state.isEmbassyLoading = false;
                state.embassyData = action.payload;
            })
            .addCase(updateEmbassyByEmail.rejected, (state, action) => {
                state.isEmbassyLoading = false;
                state.hasEmbassyerror = action.payload;
            })
    }
})

export default embassySlice.reducer;
