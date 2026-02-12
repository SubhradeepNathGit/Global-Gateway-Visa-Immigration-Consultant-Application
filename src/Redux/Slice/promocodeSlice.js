import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../../util/Supabase/supabase";

// slice to add new promocode
export const addCode = createAsyncThunk("promocodeSlice/addCode",
    async ({ codeData }, { rejectWithValue }) => {
        // console.log('New promocode details',codeData);

        try {
            const res = await supabase.from("promocode").insert([codeData]).select();
            // console.log('Response for adding new promocode', res);

            if (res.error) return rejectWithValue(res.error.message);
            return res?.data[0];
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// slice to fetch all promocode
export const fetchCodes = createAsyncThunk("promocodeSlice/fetchCodes",
    async ({ status } = {}, { rejectWithValue }) => {
        try {
            let query = supabase.from("promocode").select("*").order("created_at", { ascending: true });

            if (status) {
                query = query.eq("status", status);
            }
            const res = await query;
            // console.log('Response for fetching all promocode', res);

            if (res.error) return rejectWithValue(res.error.message);

            return res?.data;
        }
        catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// slice to update promocode
export const updateCode = createAsyncThunk("promocodeSlice/updateCode",
    async ({ id, updatedData }, { rejectWithValue }) => {
        // console.log('Updated promocode details',id, updatedData);

        try {
            const res = await supabase.from("promocode").update(updatedData).eq("id", id).select();
            // console.log('Response for updating charges', res);

            if (res.error) return rejectWithValue(res.error.message);
            return res?.data[0];
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// slice to update promocode status
export const updateCodeStatus = createAsyncThunk("promocodeSlice/updateCodeStatus",
    async ({ id, updateStatus }, { rejectWithValue }) => {
        // console.log('Updated promocode status', id, updateStatus);

        try {
            const res = await supabase.from("promocode").update({ status: updateStatus }).eq("id", id).select();
            // console.log('Response for updating promocode status', res);

            if (res.error) return rejectWithValue(res.error.message);
            return { id, status: updateStatus };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// slice to delete charges
export const deleteCode = createAsyncThunk("promocodeSlice/deleteCode",
    async (id, { rejectWithValue }) => {
        // console.log('Deleted promocode id',id);

        try {
            const res = await supabase.from("promocode").delete().eq("id", id).select();
            // console.log('Response for deleting promocode', res);

            if (res.error) return rejectWithValue(res.error.message);
            return res.data[0];
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);


const initialState = {
    allCode: [],
    isCodeLoading: false,
    isCodeStatusLoading: false,
    hasCodesError: null
}

export const promocodeSlice = createSlice({
    name: "promocodeSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // add new charges
            .addCase(addCode.pending, (state) => {
                state.isCodeLoading = true;
            })
            .addCase(addCode.fulfilled, (state, action) => {
    state.isCodeLoading = false;
    state.allCode.push(action.payload); 
})
            .addCase(addCode.rejected, (state, action) => {
                state.isCodeLoading = false;
                state.hasCodesError = action.payload;
            })

            // fetch all charges
            .addCase(fetchCodes.pending, (state) => {
                state.isCodeLoading = true;
            })
            .addCase(fetchCodes.fulfilled, (state, action) => {
                state.isCodeLoading = false;
                state.allCode = action.payload ?? [];
            })
            .addCase(fetchCodes.rejected, (state, action) => {
                state.isCodeLoading = false;
                state.hasCodesError = action.payload;
            })

            // update charges
            .addCase(updateCode.pending, (state) => {
                state.isCodeLoading = true;
            })
            .addCase(updateCode.fulfilled, (state, action) => {
                state.isCodeLoading = false;
                // state.allCode = action.payload;
            })
            .addCase(updateCode.rejected, (state, action) => {
                state.isCodeLoading = false;
                state.hasCodesError = action.payload;
            })

            // update charges status
            .addCase(updateCodeStatus.pending, (state) => {
                state.isCodeStatusLoading = true;
            })
            .addCase(updateCodeStatus.fulfilled, (state, action) => {
                state.isCodeStatusLoading = false;

                const { id, status } = action.payload;
                const charge = state.allCode.find(c => c.id === id);
                if (charge) {
                    charge.status = status;
                }
            })
            .addCase(updateCodeStatus.rejected, (state, action) => {
                state.isCodeStatusLoading = false;
                state.hasCodesError = action.payload;
            })

            // delete charges
            .addCase(deleteCode.pending, (state) => {
                state.isCodeLoading = true;
            })
            .addCase(deleteCode.fulfilled, (state, action) => {
                state.isCodeLoading = false;
                // state.allCode = action.payload;
            })
            .addCase(deleteCode.rejected, (state, action) => {
                state.isCodeLoading = false;
                state.hasCodesError = action.payload;
            });
    },
});

export default promocodeSlice.reducer;