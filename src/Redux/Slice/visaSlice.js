import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// Fetch all visa types for specific country slice
export const fetchVisaForCountry = createAsyncThunk("visaSlice/fetchVisaForCountry",
    async (countryId, { rejectWithValue }) => {
        console.log('Fetching visa for country id', countryId);
        try {
            // Fetch visa ID list from country_visas
            const res = await supabase.from("country_visas").select("visa_id").eq("country_id", countryId).single();
            console.log("Response after fetching visa Id's for specific country", res);
            if (res.error) return rejectWithValue(res.error.message);

            const visaIDs = res.data?.visa_id || [];
            if (visaIDs.length === 0) return [];

            // Fetch visa list
            const visaRes = await supabase.from("visa").select("*").in("id", visaIDs);
            console.log('Response after fetching info for specific visa', visaRes);

            if (visaRes.error) return rejectWithValue(visaRes.error.message);

            const visas = visaRes.data;

            // Fetch visa_details for this country
            const detailsRes = await supabase.from("visa_details").select("*").eq("country_id", countryId).in("visa_id", visaIDs);
            console.log('Response after fetching details for specific visa', detailsRes);

            if (detailsRes.error) return rejectWithValue(detailsRes.error.message);

            const visaDetails = detailsRes.data;

            // Merge visa and visa_details
            const merged = visas.map(v => ({
                ...v,
                visa_details: visaDetails.filter(d => d.visa_id === v.id)
            }));

            return merged;

        }
        catch (err) {
            console.log('Error occured', err);
            return rejectWithValue(err.message);
        }
    }
);

// Update visa detail
export const updateVisa = createAsyncThunk('visaDetailsSlice/updateVisa',
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Received visa to edit in slice', id, updatedData);

        try {
            const res = await supabase.from('visa').update(updatedData).eq('id', id).select();
            // console.log('Response for updating visa details', res);

            if (res?.error) throw res?.error
            return res?.data[0]
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// fetch all visa from visa table 
export const fetchAllVisa = createAsyncThunk("visaSlice/fetchAllVisa",
    async (_, { rejectWithValue }) => {
        try {
            const res = await supabase.from("visa").select("*").order("created_at", { ascending: false });
            // console.log('Response for fetching all visa', res);

            if (res?.error) throw res?.error
            return res?.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// fetch visa from visa table exist or not
export const fetchVisaByType = createAsyncThunk("visaSlice/fetchVisaByType",
    async (visaType, { rejectWithValue }) => {

        console.log('Fetched visa type exist or not', visaType);
        try {
            const normalized = visaType.trim().replace(/\s+/g, " ");

            const res = await supabase.from("visa").select("id, visa_type, status").ilike("visa_type", normalized).maybeSingle();
            // console.log('Response for fetching visa exist or not', res);

            if (res?.error) throw res?.error

            if (res?.data && res?.data.visa_type.trim().replace(/\s+/g, " ").toLowerCase() !== normalized.toLowerCase()) {
                return null;
            }

            return res?.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// add new visa in visa table 
export const addVisa = createAsyncThunk("visaSlice/addVisa",
    async (visaObj, { rejectWithValue }) => {
        // console.log('Receive visa data to add in visa table', visaObj);

        try {
            const res = await supabase.from("visa").insert(visaObj).select("id, visa_type").single()
            // console.log('Response for adding new visa in visa table', res);

            if (res?.error) throw res?.error
            return res?.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// check country visa
export const checkVisaForCountry = createAsyncThunk("visaSlice/checkVisaForCountry",
    async ({ countryId, visitorCountry, visaId }, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase.from("country_visas").select("*").eq("country_id", countryId).eq("visitor_country", visitorCountry).contains("visa_id", [visaId]).maybeSingle()

            if (error) throw error
            return data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// fetch grant visa for a specific country 
export const fetchCountryVisa = createAsyncThunk("visaSlice/fetchCountryVisa",
    async ({ countryId, visitorCountryId }, { rejectWithValue }) => {
        // console.log('Fetching granted visa country id', countryId);

        try {
            const res = await supabase.from("country_visas").select("*").eq("country_id", countryId).eq("visitor_country", visitorCountryId).maybeSingle();
            // console.log('Response for fetching granted visa for a specific country', res);

            if (res.error) throw res.error;
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


// add grant visa for a specific country 
export const addVisaToCountry = createAsyncThunk("visaSlice/addVisaToCountry",
    async ({ countryId, visitorCountry, visaId, visaIconName }, { rejectWithValue }) => {
        // console.log('Adding granted visa details', countryId, visaId, visitorCountry);

        try {
            const res = await supabase.from("country_visas")
                .insert({
                    country_id: countryId,
                    visitor_country: visitorCountry,
                    visa_id: [visaId],
                    visa_icon: [{ [visaId]: visaIconName }],
                })
                .select("*").maybeSingle();
            // console.log('Response for adding granted visa for a specific country', res);

            if (res.error) throw res.error;
            return res.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)


// update country visa
export const updateCountryVisa = createAsyncThunk("visaSlice/updateCountryVisa",
    async ({ rowId, visaId, visaIconName, existingVisaIds, existingVisaIcons }, { rejectWithValue }) => {
        try {
            // Append new visa id to array if not exists
            const updatedVisaIds = existingVisaIds.includes(visaId) ? existingVisaIds : [...existingVisaIds, visaId];

            // Append new visa_icon object
            const updatedVisaIcons = [
                ...existingVisaIcons,
                { [visaId]: visaIconName }
            ];

            const { data, error } = await supabase.from("country_visas")
                .update({
                    visa_id: updatedVisaIds,
                    visa_icon: updatedVisaIcons,
                    updated_at: new Date(),
                })
                .eq("id", rowId).select("*").maybeSingle();

            if (error) throw error;
            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
)

// Delete visa only if not used in country_visas
export const deleteVisaTypeFromCountry = createAsyncThunk("visaSlice/deleteVisaTypeFromCountry",
    async ({ visaId, countryVisaRowId }, { rejectWithValue }) => {
        try {

            const { data: row, error: rowError } = await supabase.from("country_visas").select("*").eq("id", countryVisaRowId).maybeSingle();

            if (rowError) throw rowError;
            if (!row) return rejectWithValue("Country visa row not found");

            const { visa_id: visaIds, visa_icon: visaIcons } = row;

            if (visaIds.length > 1) {
                const updatedVisaIds = visaIds.filter(id => id !== visaId);
                const updatedVisaIcons = visaIcons.filter(iconObj => !iconObj[visaId]);

                const { data, error } = await supabase.from("country_visas")
                    .update({
                        visa_id: updatedVisaIds,
                        visa_icon: updatedVisaIcons,
                        updated_at: new Date()
                    }).eq("id", countryVisaRowId).select("*").maybeSingle();

                if (error) throw error;
                return { action: "removed_from_row", data };
            } else {

                const { data, error } = await supabase.from("country_visas").delete().eq("id", countryVisaRowId).select("*").maybeSingle();

                if (error) throw error;
                return { action: "deleted_row", data };
            }
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete visa type");
        }
    }
)

export const deleteVisaIfUnusedAnywhere = createAsyncThunk("visaSlice/deleteVisaIfUnusedAnywhere",
    async (visaId, { rejectWithValue }) => {
        try {
            const { data: rows, error } = await supabase.from("country_visas").select("*").contains("visa_id", [visaId]);

            if (error) throw error;

            // If no other rows contain this visaId, delete from visa table
            if (!rows || rows.length === 0) {
                const { data: deletedVisa, error: deleteError } = await supabase.from("visa").delete().eq("id", visaId).select("*").maybeSingle();

                if (deleteError) throw deleteError;
                return deletedVisa;
            }

            return null;
        } catch (err) {
            return rejectWithValue(err.message || "Failed to delete visa");
        }
    }
);



const initialState = {
    visaListData: [],
    isVisaListloading: false,
    isVisaListerror: null,
}

export const visaSlice = createSlice({
    name: "visaSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Fetch all visa 
            .addCase(fetchAllVisa.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(fetchAllVisa.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(fetchAllVisa.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // Fetch all visa types for specific country
            .addCase(fetchVisaForCountry.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(fetchVisaForCountry.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(fetchVisaForCountry.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // fetch visa from visa table exist or not
            .addCase(fetchVisaByType.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(fetchVisaByType.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(fetchVisaByType.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // add new visa in visa table 
            .addCase(addVisa.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(addVisa.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(addVisa.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // update visa in visa table 
            .addCase(updateVisa.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(updateVisa.fulfilled, (state, action) => {
                state.isVisaListloading = false;

                const updatedVisa = action.payload;
                const index = state.visaListData.findIndex((u) => u.id === updatedVisa.id);

                if (index !== -1) {
                    state.visaListData[index] = { ...state.visaListData[index], ...updatedVisa };
                }
            })
            .addCase(updateVisa.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // fetch grant visa for a specific country 
            .addCase(fetchCountryVisa.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(fetchCountryVisa.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(fetchCountryVisa.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // add grant visa for a specific country 
            .addCase(addVisaToCountry.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(addVisaToCountry.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(addVisaToCountry.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            // delete visa from country
            .addCase(deleteVisaTypeFromCountry.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(deleteVisaTypeFromCountry.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(deleteVisaTypeFromCountry.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            })

            .addCase(deleteVisaIfUnusedAnywhere.pending, (state) => {
                state.isVisaListloading = true;
                state.isVisaListerror = null;
            })
            .addCase(deleteVisaIfUnusedAnywhere.fulfilled, (state, action) => {
                state.isVisaListloading = false;
                state.visaListData = action.payload;
            })
            .addCase(deleteVisaIfUnusedAnywhere.rejected, (state, action) => {
                state.isVisaListloading = false;
                state.isVisaListerror = action.payload;
            });
    },
});

export default visaSlice.reducer;