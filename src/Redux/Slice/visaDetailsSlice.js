import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import supabase from '../../util/Supabase/supabase'

// Fetch all visa details
export const fetchVisaDetails = createAsyncThunk('visaDetailsSlice/fetchVisaDetails',
    async ({ countryId, visitorCountryId, visa_id }, { rejectWithValue }) => {
        try {
            const res = await supabase.from('visa_details').select('*').eq('country_id', countryId).eq('visa_id', visa_id).eq('visitor_country_id', visitorCountryId);
            // console.log('Response for fetching visa details', res);

            if (res?.error) throw res?.error
            return res?.data
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Add a new visa detail
export const addVisaDetail = createAsyncThunk('visaDetailsSlice/addVisaDetail',
    async (visaData, { rejectWithValue }) => {
        // console.log('Received visa details to add in slice', visaData);

        try {
            const res = await supabase.from('visa_details').insert([visaData]).select();
            // console.log('Response for adding visa details', res);

            if (res?.error) throw res?.error
            return res?.data[0]
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Update an existing visa detail
export const updateVisaDetail = createAsyncThunk('visaDetailsSlice/updateVisaDetail',
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Received visa details to edit in slice', id, updatedData);

        try {
            const res = await supabase.from('visa_details').update(updatedData).eq('id', id).select();
            // console.log('Response for updating visa details', res);

            if (res?.error) throw res?.error
            return res?.data[0]
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

// Delete a visa detail
export const deleteVisaDetail = createAsyncThunk('visaDetailsSlice/deleteVisaDetail',
    async (id, { rejectWithValue }) => {
        // console.log('Deleted visa id', id);

        try {
            const { error } = await supabase.from('visa_details').delete().eq('id', id);

            if (error) throw error
            return id
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const initialState = {
    visaDetails: [],
    loadingVisaDetails: false,
    visaDetailsError: null,
}

export const visaDetailsSlice = createSlice({
    name: 'visaDetailsSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchVisaDetails.pending, (state) => {
                state.loadingVisaDetails = true
                state.visaDetailsError = null
            })
            .addCase(fetchVisaDetails.fulfilled, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetails = action.payload
            })
            .addCase(fetchVisaDetails.rejected, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetailsError = action.payload
            })

            // Add
            .addCase(addVisaDetail.pending, (state) => {
                state.loadingVisaDetails = true
                state.visaDetailsError = null
            })
            .addCase(addVisaDetail.fulfilled, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetails.push(action.payload)
            })
            .addCase(addVisaDetail.rejected, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetailsError = action.payload
            })

            // Update
            .addCase(updateVisaDetail.pending, (state) => {
                state.loadingVisaDetails = true
                state.visaDetailsError = null
            })
            .addCase(updateVisaDetail.fulfilled, (state, action) => {
                state.loadingVisaDetails = false
                const index = state.visaDetails.findIndex(v => v.id === action.payload.id)
                if (index !== -1) state.visaDetails[index] = action.payload
            })
            .addCase(updateVisaDetail.rejected, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetailsError = action.payload
            })

            // Delete
            .addCase(deleteVisaDetail.pending, (state) => {
                state.loadingVisaDetails = true
                state.visaDetailsError = null
            })
            .addCase(deleteVisaDetail.fulfilled, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetails = state.visaDetails.filter(v => v.id !== action.payload)
            })
            .addCase(deleteVisaDetail.rejected, (state, action) => {
                state.loadingVisaDetails = false
                state.visaDetailsError = action.payload
            })
    },
})

export default visaDetailsSlice.reducer